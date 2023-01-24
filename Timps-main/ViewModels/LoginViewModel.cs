using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Maui;
using Plugin.ValidationRules.Rules;

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using TekTrackingCore.Models;
using TekTrackingCore.Repositry;
using TekTrackingCore.Services;






namespace TekTrackingCore.ViewModels
{
    public partial class LoginViewModel : BaseViewModel
    {
        private readonly ILoginRepository loginRepository;
        public Action<bool> showLoading { get; set; }
        public Action<string,bool> emailStatus { get; set; }

        public LoginService logInService;
        public LoginViewModel()
        {
            IsLoading = true;
            logInService = new LoginService();
            getLoggedInUser();
            loginRepository = new LoginService();
            //bool flag = loginRepository.IsAlreadyLoggedIn();
            //if (flag == true)
            //{
            //    IsLoading = true;
            //    // loginRepository.Proceed();

            //}
        }
        public async void  getLoggedInUser()
        {
            var loggedInuser = await logInService.GetUserInfo();
             if (loggedInuser.Count() > 0)
            {
                // because there will be only one loggedInUser everytime, if new user loggedin then already existing user
                // will be replaced by new user
                UserInfo userinfo = new UserInfo();
                foreach (var user in loggedInuser)
                {
                    userinfo.UserName = user.UserName;
                    userinfo.UserId = user.UserId;
                    userinfo.Token = user.Token;

                }
                Preferences.Set(AppConstants.TOKEN_KEY, userinfo.Token);
                IsLoading = false;
                await logInService.Proceed();

            }
        }

        [ObservableProperty]
        private string email;

        [ObservableProperty]
        private string password;

        [ObservableProperty]
        public bool isLoading;

        //[RelayCommand]
        //async Task Login() 
        //{

        //   UserInfo info = await loginRepository.Login(email, password); 
        //    if(info == null) 
        //    {       
        //    }
        //    else 
        //    { // Route to DashBoard.

        //    }

        //}

        public bool IsLoggedIn
        {
            get
            {
                return loginRepository.IsAlreadyLoggedIn();
            }
        }

        public bool IsLoggedOut
        {
            get
            {
                return !loginRepository.IsAlreadyLoggedIn();
            }
        }

        public string BtnTextString
        {
            get
            {
                return loginRepository.BtnText();
            }
        }

        [RelayCommand]
        private async Task<Task> Login()
        {

            //if (!IsLoggedIn)
            //{

            //    return loginRepository.Logout();

            //}

            //else
            //{

           

            return loginRepository.Login(email, password, showLoading, emailStatus);
            //}

        }

     
        [RelayCommand]
        public void Proceed()
        {
            loginRepository.Proceed();
        }

        [RelayCommand]
        public async void Setting()
        {
            await Shell.Current.GoToAsync("Setting");

        }

    }
}
