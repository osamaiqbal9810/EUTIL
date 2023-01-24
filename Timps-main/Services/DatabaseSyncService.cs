
using SQLite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using TekTrackingCore.Framework;
using TekTrackingCore.Framework.Types;
using TekTrackingCore.Model;
using TekTrackingCore.Models;

namespace TekTrackingCore.Services
{
    public class DatabaseSyncService
    {
        private SQLiteAsyncConnection _dbConnection;
        private CreateTableResult PullListItems;
        private CreateTableResult UsersList;

        public async System.Threading.Tasks.Task SetUpDb()
        {
            if (_dbConnection == null)
            {
                string dbPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Eutility.db3");
                _dbConnection = new SQLiteAsyncConnection(dbPath);
                PullListItems = await _dbConnection.CreateTableAsync<StaticListItemDTO1>();
                UsersList = await _dbConnection.CreateTableAsync<UserInfo>();
            }

            if (PullListItems != SQLite.CreateTableResult.Created || PullListItems != CreateTableResult.Migrated)
            {
                PullListItems = await _dbConnection.CreateTableAsync<StaticListItemDTO1>();
            }
            if (UsersList != SQLite.CreateTableResult.Created || UsersList != CreateTableResult.Migrated)
            {
                UsersList = await _dbConnection.CreateTableAsync<UserInfo>();
            }
        }

        public TimerDelegate<string> timerTask;
        public int count;
        public string results;
        public List<StaticListItemDTO1> staticListItemDTOs { get; set; }
        public System.Action SetSyncCallback { get; set; }
        public string LastTimestamp { get; set; }

        private JsonSerializerOptions _serializerOptions;
        public async void Start()
        {

            staticListItemDTOs = new List<StaticListItemDTO1>();
            Poll();

            timerTask = new TimerDelegate<string>(() =>
            {

                Application.Current.Dispatcher.DispatchAsync(() =>
                {
                    Poll();
                });

                return results;

            }, AppConstants.DBTIMESYNCINTERVAL);
            timerTask.OnCompleted += TimerTask_OnCompleted; ; ;
            timerTask.Start();


        }

        public void Stop()
        {
            timerTask.Stop();

        }

        public async void Poll()
        {
            NetworkAccess accessType = Connectivity.Current.NetworkAccess;

            if (accessType == NetworkAccess.Internet)
            {

                await SetUpDb();
                Server s = new Server();

                staticListItemDTOs.Clear();
                System.Diagnostics.Debug.WriteLine("This is a log", s.LIST_URL);

                JSONWebService service = ServiceResolver.ServiceProvider.GetRequiredService<JSONWebService>();
                string url = string.Format(s.LIST_URL, 300, LastTimestamp);
                results = await service.GetJSONAsync(url, 10000);


                var responseDTO = JsonSerializer.Deserialize<MessageListResponseDTO>(results);
                var serverPlansList = new List<StaticListItemDTO1>();
                if (responseDTO != null)
                {
                    serverPlansList.Clear();
                    LastTimestamp = responseDTO.Ts;
                    var localListItems = await GetMessageListResponseDTO();
                    foreach (var itemDTO in responseDTO.Result)
                    {
                        foreach (var item in itemDTO)
                        {
                            if (item.ListName == "WorkPlanTemplate")
                            {
                                serverPlansList.Add(item);
                                
                            }
                            await InsertMessageListResponseDTO(item);
                        }
                    }
                    // sync if any insepection is deleted on server then remove from list
                    if (localListItems.Count() > 0)
                    {
                        var localWPlans = localListItems.Where(localPlans => localPlans.ListName == "WorkPlanTemplate").Take(100);

                        foreach (var listItem in localWPlans)
                        {
                            Console.WriteLine(listItem.Code);
                            var findOnServer = serverPlansList.Find(planList => planList.Code == listItem.Code);
                            if (findOnServer == null)
                            {
                                await DeleteMessageListResponseDTO(listItem);
                            }

                        }
                    }

                }
            }
        }



        private void TimerTask_OnCompleted(object sender, string e)
        {
            if (SetSyncCallback != null) { SetSyncCallback(); };
        }

        // PullListItems model
        public async Task<List<StaticListItemDTO1>> GetMessageListResponseDTO()
        {
            await SetUpDb();
            var units = await _dbConnection.Table<StaticListItemDTO1>().ToListAsync();
            return units;
        }

        public async Task<int> DeleteMessageListResponseDTO(StaticListItemDTO1 responseDTO)
        {
            await SetUpDb();
            return await _dbConnection.DeleteAsync(responseDTO);
        }
        public async Task<int> UpdateMessageListResponseDTO(StaticListItemDTO1 responseDTO)
        {
            await SetUpDb();
            return await _dbConnection.UpdateAsync(responseDTO);
        }
        public async Task<int> InsertMessageListResponseDTO(StaticListItemDTO1 responseDTO)
        {
            await SetUpDb();
            if(responseDTO.ListName == "WorkPlanTemplate")
            {

            }
            var msgRespnse = await GetMessageListResponseDTO();
            var alreadyExist = msgRespnse.Where(response => response.Code == responseDTO.Code);
            var item = alreadyExist.FirstOrDefault();
            if (item == null)
            {
                return await _dbConnection.InsertAsync(responseDTO);
            }
            else
            {
                await _dbConnection.DeleteAsync(item);
                return await _dbConnection.InsertAsync(responseDTO);
            }

        }
        // for logged in user
        // local db setup

        public async Task<List<UserInfo>> GetUserInfo()
        {
            // await SetUpDb();
            var users = await _dbConnection.Table<UserInfo>().ToListAsync();
            return users;
        }

        public async Task<int> DeleteUserInfo(UserInfo userInfo)
        {
            await SetUpDb();
            return await _dbConnection.DeleteAsync(userInfo);
        }
        public async Task<int> InsertUnitInfo(UserInfo userInfo)
        {
            await SetUpDb();
            var users = await GetUserInfo();
            var alreadyExist = users.Where(user => user.Token == userInfo.Token);
            var item = alreadyExist.FirstOrDefault();
            if (item == null)
            {
                return await _dbConnection.InsertAsync(userInfo);
            }
            else
            {
                return await _dbConnection.UpdateAsync(userInfo);
            }
        }

    }
}
