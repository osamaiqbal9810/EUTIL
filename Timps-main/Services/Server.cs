using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.ConstrainedExecution;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace TekTrackingCore.Services
{
    public  class Server
    {



        string serverUrl;
        public string serverAdd   // property
        {
            get { return serverUrl; }   // get method
            set { serverUrl = value; }  // set method
        }




        public Server()
        {
            bool hasKey = Preferences.Default.ContainsKey("serverEndpoint");
            string defaultUrl = "electric-utility-inspection-system.onrender.com";

            serverUrl = hasKey ? Preferences.Get("serverEndpoint", ""): defaultUrl;

            ServerUrl= Scheme+"://"+serverAdd;
            Login_RestUrl = $"{ServerUrl}/api/login";
            LIST_URL = $"{ServerUrl}/api/list/pull/300";
            JourneyPlan_URL = $"{ServerUrl}/api/journeyPlan";
            JourneyPlanStart_URL = $"{ServerUrl}/api/journeyPlanStart";

        }
       

    

        // URL of REST service (Android does not use localhost)
        // Use http cleartext for local deployment. Change to https for production

        public static string LocalhostUrl = DeviceInfo.Platform == DevicePlatform.Android ? "172.19.91.167" : "172.19.91.167";
        public string ServerUrl; /*DeviceInfo.Platform == DevicePlatform.Android ? serverAdd : serverAdd;*/
        //    public static string LocalhostUrl = DeviceInfo.Platform == DevicePlatform.Android ? "192.168.1.8" : "localhost";
        public static string Scheme = "https"; // or https
        public static string Port = "4001"; // 5000 for http, 5001 for https


        //public static string LIST_URL = $"{Scheme}://{LocalhostUrl}:{Port}/api/list/pull/300";
        public  string LIST_URL; /*= $"{ServerUrl}/api/list/pull/300";*/

        //public static string JourneyPlan_URL = $"{Scheme}://{LocalhostUrl}:{Port}/api/journeyPlan";
        public  string JourneyPlan_URL; /* = $"{ServerUrl}/api/journeyPlan";*/

        //public static string JourneyPlanStart_URL = $"{Scheme}://{LocalhostUrl}:{Port}/api/journeyPlan/journeyPlanStart";
         public  string JourneyPlanStart_URL; /*= $"{ServerUrl}/api/journeyPlanStart";*/

        //public static string Login_RestUrl = $"{Scheme}://{LocalhostUrl}:{Port}/api/login";
        public  string Login_RestUrl; /*= $"{ServerUrl}/api/login";*/


        public static string USER_DETAILS = "USERDETAIL";
        public const string TOKEN_KEY = "token";
        public const int DBTIMESYNCINTERVAL = 15000;



    }
}
