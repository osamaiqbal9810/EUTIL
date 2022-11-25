
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

namespace TekTrackingCore.Services
{
    public class LoginService : ILoginRepository
    {

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


        public async Task<UserInfo> Login(string username, string password)
        {
            UserInfo userinfo;
            try
            {
                userinfo = new UserInfo();
                var httpclient = new HttpClient();
                //string url = Globals.wsBaseURL + "/login/";
                string url = "http://172.19.91.167:4040/api/login/";

                //string userloginjson = @"{ ""user"":{ ""email"":""medmonds@tektracking.com"",""password"":""welcome""}}";
                LoginRequest request = new LoginRequest();
                request.user.email = username;
                request.user.password = password;
                string testuser = JsonConvert.SerializeObject(request);

                StringContent content = new StringContent(testuser, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await httpclient.PostAsync(new Uri(url), content);

                if (response.IsSuccessStatusCode)
                {
                    string serialized = await response.Content.ReadAsStringAsync();
                    System.Diagnostics.Debug.WriteLine(serialized, "serialized.............................................................");
                    //Console.WriteLine(serialized, "serialized");

                    var userinfolist = LoginInfo.FromJson(serialized);
                    Console.WriteLine("userinfolist");

                    Preferences.Set(typeof(LoginInfo).ToString(), serialized);




                    userinfo.UserName = userinfolist.Result.Name;
                    userinfo.UserId = userinfolist.Result.Id;
                    userinfo.Token = userinfolist.Token;
                    Preferences.Set(AppConstants.TOKEN_KEY, userinfo.Token);
                    Preferences.Set(AppConstants.USER_DETAILS, serialized);
                    //System.Diagnostics.Debug.WriteLine(Preferences.Get(typeof(AppConstants.TOKEN_KEY).ToString(), ""));
                    System.Diagnostics.Debug.WriteLine(userinfolist, "userinfo list");

                    App.CurrentUserDetails = userinfolist;

                    await Shell.Current.GoToAsync("ProceedPage");
                    // await Shell.Current.GoToAsync($"//{nameof(ProceedPage)}");
                    return await Task.FromResult(userinfo);


                }
                else
                {

                    return null;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex, "login exception");
            }
            //finally
            //{
            //    //done

            //}
            return null;
        }

        public bool IsAlreadyLoggedIn()
        {

            System.Diagnostics.Debug.WriteLine(Preferences.ContainsKey(typeof(LoginInfo).ToString()));
            return Preferences.ContainsKey(typeof(LoginInfo).ToString());

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


        public async Task<UserInfo> Logout()
        {
            var userInfo = new UserInfo();
            if (Preferences.ContainsKey(typeof(LoginInfo).ToString()))
            {
                Preferences.Remove(typeof(LoginInfo).ToString());

            }

            bool isLoggedIn = IsAlreadyLoggedIn();
            //await Shell.Current.GoToAsync("LogIn");
            await Shell.Current.GoToAsync($"//{nameof(LoginPage)}");

            //await Shell.Current.GoToAsync("///login");
            return await Task.FromResult(userInfo);
        }


        async public Task Proceed()
        {
            //await Shell.Current.GoToAsync("/dashboard");
           // await Shell.Current.GoToAsync("ProceedPage");
            await Shell.Current.GoToAsync($"//{nameof(Briefing)}");
        }



    }
}
