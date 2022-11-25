using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Model;
using TekTrackingCore.Models;
using TekTrackingCore.Views;

namespace TekTrackingCore.ViewModels
{
    public partial class AppShellViewModel : BaseViewModel

    {

        [RelayCommand]
        async void SignOut()
        {
           
            if (Preferences.ContainsKey(nameof(UserInfo).ToString()))
            {
              
                Preferences.Remove(nameof(UserInfo).ToString());
                
            }

            await Shell.Current.GoToAsync($"//{nameof(LoginPage)}");
            Shell.Current.FlyoutIsPresented = false;


        }
    }


    }





