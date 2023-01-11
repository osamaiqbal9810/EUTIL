
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using TekTrackingCore.Framework;
using TekTrackingCore.Framework.Types;

namespace TekTrackingCore.Services
{
    public class DatabaseSyncService
    {


        public TimerDelegate<string> timerTask;
        public int count;
        public string results;
        public List<StaticListItemDTO1> staticListItemDTOs { get; set; }
        public Action SetSyncCallback { get; set; }
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
            Server s = new Server();

            staticListItemDTOs.Clear();
            System.Diagnostics.Debug.WriteLine("This is a log", s.LIST_URL);

            JSONWebService service = ServiceResolver.ServiceProvider.GetRequiredService<JSONWebService>();
            string url = string.Format(s.LIST_URL, 300, LastTimestamp);
            results = await service.GetJSONAsync(url, 10000);


            var responseDTO = JsonSerializer.Deserialize<MessageListResponseDTO>(results);

            //Preferences.Set(typeof(LoginInfo).ToString(), responseDTO.ToString());
            Preferences.Default.Set("work_plan", responseDTO.Result);
            var a = Preferences.Get("work_plan", "");
            Console.WriteLine(a);


            if (responseDTO != null)
            {
                LastTimestamp = responseDTO.Ts;
                foreach (var itemDTO in responseDTO.Result)
                {
                    staticListItemDTOs.AddRange(itemDTO);
                }
            }
        }



        private void TimerTask_OnCompleted(object sender, string e)
        {
            Console.WriteLine(e);

            if (SetSyncCallback != null) { SetSyncCallback(); };
        }
    }
}
