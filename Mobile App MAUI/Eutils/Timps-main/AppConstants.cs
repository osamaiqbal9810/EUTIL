using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore
{
    public static class AppConstants
    {

        // URL of REST service (Android does not use localhost)
        // Use http cleartext for local deployment. Change to https for production

        public static string LocalhostUrl = DeviceInfo.Platform == DevicePlatform.Android ? "172.19.91.167" : "172.19.91.167";
        //    public static string LocalhostUrl = DeviceInfo.Platform == DevicePlatform.Android ? "192.168.1.8" : "localhost";
        public static string Scheme = "http"; // or https
        public static string Port = "4040"; // 5000 for http, 5001 for https
        public static string LIST_URL = $"{Scheme}://{LocalhostUrl}:{Port}/api/list/pull/300";
        public static string Login_RestUrl = $"{Scheme}://{LocalhostUrl}:{Port}/api/login";
        public static string USER_DETAILS = "USERDETAIL";
        public const string TOKEN_KEY = "token";


        public const int DBTIMESYNCINTERVAL = 15000;

    }
}
