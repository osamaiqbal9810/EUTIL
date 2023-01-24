using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Model;
using TekTrackingCore.Models;
using TekTrackingCore.Services;
using TekTrackingCore.Views;
namespace TekTrackingCore.ViewModels
{
    public partial class AppShellViewModel : BaseViewModel
    {
        public LoginService logInService;
        [RelayCommand]
        async Task<UserInfo> SignOut()
        {
            bool response = await App.Current.MainPage.DisplayAlert("Are you sure ?", "Do you want to log out ?", "Log Out", "Cancel");
            if (response == true)
            {
                var userInfo = new UserInfo();
                if (Preferences.ContainsKey(typeof(LoginInfo).ToString()))
                {
                    Preferences.Remove(typeof(LoginInfo).ToString());
                }
                await Shell.Current.GoToAsync($"//{nameof(LoginPage)}");
                Shell.Current.FlyoutIsPresented = false;
                logInService = new LoginService();
                var loggedInuser = await logInService.GetUserInfo();
                if (loggedInuser.Count() > 0)
                {
                    // because there will be only one loggedInUser everytime, if new user loggedin then already existing user
                    // will be replaced by new user

                    foreach (var user in loggedInuser)
                    {
                        await logInService.DeleteUserInfo(user);
                    }


                }
                return await Task.FromResult(userInfo);
            }
            else
            {
                return null;
            }
        }
        [RelayCommand]
        async public void UserProfile()
        {
            await Shell.Current.GoToAsync($"//{nameof(UserProfilePage)}");
            Shell.Current.FlyoutIsPresented = false;
        }
        [RelayCommand]
        async public void MainDashbaord()
        {
            await Shell.Current.GoToAsync($"//{nameof(Briefing)}");
            Shell.Current.FlyoutIsPresented = false;
        }
    }
}