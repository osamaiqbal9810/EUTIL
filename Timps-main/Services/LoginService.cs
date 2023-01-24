
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Repositry;
using TekTrackingCore.Models;
using Newtonsoft.Json;
using TekTrackingCore.Model;
using TekTrackingCore.Views;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Maui.Controls;
using SQLite;
using TekTrackingCore.Framework;
using CommunityToolkit.Maui.Core;
using CommunityToolkit.Maui.Alerts;
namespace TekTrackingCore.Services
{
    public class LoginService : ILoginRepository
    {
        private SQLiteAsyncConnection _dbConnection;
        private CreateTableResult UsersList;

        public async System.Threading.Tasks.Task SetUpDb()
        {
            if (_dbConnection == null)
            {
                string dbPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Eutility.db3");
                _dbConnection = new SQLiteAsyncConnection(dbPath);
                UsersList = await _dbConnection.CreateTableAsync<UserInfo>();
            }

            if (UsersList != SQLite.CreateTableResult.Created || UsersList != CreateTableResult.Migrated)
            {
                UsersList = await _dbConnection.CreateTableAsync<UserInfo>();
            }
        }

        public class LoginRequest
        {
            public User user { get; set; }

            public LoginRequest()
            {
                this.user = new User();
            }
        }

        public class User
        {
            public string email { get; set; }
            public string password { get; set; }

        }


        public async Task<UserInfo> Login(string username, string password, Action<bool> showLoading, Action<string, bool> emailStatus)
        {
            UserInfo userinfo;
            try
            {
                var loggedInuser = await GetUserInfo();
                NetworkAccess accessType = Connectivity.Current.NetworkAccess;
                if (accessType == NetworkAccess.Internet)
                {
                    Server s = new Server();
                    showLoading(true);
                    IsLoadingLogin(true);
                    userinfo = new UserInfo();
                    var httpclient = new HttpClient();

                    string url = string.Format(s.Login_RestUrl);

                    LoginRequest request = new LoginRequest();
                    request.user.email = username;
                    request.user.password = password;
                    string testuser = JsonConvert.SerializeObject(request);

                    StringContent content = new StringContent(testuser, Encoding.UTF8, "application/json");

                    HttpResponseMessage response = await httpclient.PostAsync(new Uri(url), content);

                    if (response.IsSuccessStatusCode)
                    {
                        showLoading(false);
                        IsLoadingLogin(false);


                        string serialized = await response.Content.ReadAsStringAsync();
                        var userinfolist = LoginInfo.FromJson(serialized);

                        Preferences.Set(typeof(LoginInfo).ToString(), serialized);

                        userinfo.UserName = userinfolist.Result.Name;
                        userinfo.UserId = userinfolist.Result.Id;
                        userinfo.Token = userinfolist.Token;

                        Preferences.Set(AppConstants.TOKEN_KEY, userinfo.Token);
                        Preferences.Set(AppConstants.USER_DETAILS, serialized);

                        App.CurrentUserDetails = userinfolist;
                        await InsertUnitInfo(userinfo);
                        await Shell.Current.GoToAsync("ProceedPage");
                       // return await Task.FromResult(userinfo);
                    }
                    else
                    {
                        emailStatus(response.StatusCode.ToString(), true);
                        return null;
                    }
                }
                else
                {
                    IsLoadingLogin(false);
                    var toast = Toast.Make("No Internet Access! Please connect to internet to log in", ToastDuration.Long);
                    await toast.Show();
                }
                
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex, "login exception");
            }
            return null;
        }

        public bool IsAlreadyLoggedIn()
        {

            System.Diagnostics.Debug.WriteLine(Preferences.ContainsKey(typeof(LoginInfo).ToString()));
            return Preferences.ContainsKey(typeof(LoginInfo).ToString());

        }

        public bool IsLoadingLogin(bool status)
        {
            return status;

        }

        public string BtnText()
        {
            bool isLoggedIn = IsAlreadyLoggedIn();

            if (isLoggedIn == true)
            {

                return "Log in";

            }
            else
            {
                return "Log out";
            }

        }


        public async void Logout()
        {
            
            if (Preferences.ContainsKey(typeof(LoginInfo).ToString()))
            {
                Preferences.Remove(typeof(LoginInfo).ToString());

            }

            bool isLoggedIn = IsAlreadyLoggedIn();
            var loggedInuser = await GetUserInfo();
            if (loggedInuser.Count() > 0)
            {
                // because there will be only one loggedInUser everytime, if new user loggedin then already existing user
                // will be replaced by new user
                
                foreach (var user in loggedInuser)
                {
                    await DeleteUserInfo(user);
                }


            }
            await Shell.Current.GoToAsync($"//{nameof(LoginPage)}");
          
            

            
        }


        async public Task Proceed()
        {
            //await Shell.Current.GoToAsync("/dashboard");
            // await Shell.Current.GoToAsync("ProceedPage");
            await Shell.Current.GoToAsync($"//{nameof(Briefing)}");
        }

        // for logged in user
        // local db setup

        public async Task<List<UserInfo>> GetUserInfo()
        {
             await SetUpDb();
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
