using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Model;
using TekTrackingCore.Models;
using TekTrackingCore.Sample.Models;
using TekTrackingCore.Services;
using TekTrackingCore.Views;
namespace TekTrackingCore.ViewModels
{
    public partial class AppShellViewModel :  BaseViewModel
    {
        public LoginService logInService;
        DatabaseSyncService service;

        [ObservableProperty]
        public bool isOffline;
        public System.Action StopTimer { get; set; }
        public InspectionService inspectionService;
        public AppShellViewModel()
        {
            service = new DatabaseSyncService();
            inspectionService = new InspectionService();
            Connectivity.ConnectivityChanged += Connectivity_ConnectivityChanged; ;
            //service.Start(); 
        }
        ~AppShellViewModel()
        {
            Connectivity.ConnectivityChanged -= Connectivity_ConnectivityChanged;
        }

        private void Connectivity_ConnectivityChanged(object sender, ConnectivityChangedEventArgs e)
        {
            if (e.NetworkAccess != NetworkAccess.Internet)
            {
                IsOffline = true;
            }
            else {
                IsOffline = false;
            }
        }

        [RelayCommand]
        async void SignOut()
        {
            try
            {
                var userInfo = new UserInfo();

                List<SessionModel> sessions = await inspectionService.GetWorkPlanDtos();
                bool response = await App.Current.MainPage.DisplayAlert("Are you sure ?", "Do you want to log out ?", "Log Out", "Cancel");
                if (response == true && sessions.Count <= 0)
                {

                    if (Preferences.ContainsKey(typeof(LoginInfo).ToString()))
                    {
                        Preferences.Remove(typeof(LoginInfo).ToString());
                    }

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
                    // clear local database
                    await inspectionService.DeleteAllInProgressToPush();
                    await inspectionService.DeleteAllReportToPush();
                    await inspectionService.DeleteAllReports();
                    await inspectionService.DeleteAllUnitForm();
                    await inspectionService.DeleteAllUnitSession();
                    await inspectionService.DeleteAllWorkPlanDto();
                    await inspectionService.DeleteAllActiveInspections();
                    await service.DeleteAllMessageListResponseDTO();
                    service.Stop();

                    await Shell.Current.GoToAsync($"//{nameof(LoginPage)}");
                    Shell.Current.FlyoutIsPresented = false;
                    MauiProgram.SetMainDashboardPage();
                }
                else if (response == true && sessions.Count > 0)
                {
                    bool isNotSynced = await App.Current.MainPage.DisplayAlert("All data is not synced with cloud !", "Your all offline data will be wiped out.", "Sign Out", "Cancel");
                    if (isNotSynced == true)
                    {

                        if (Preferences.ContainsKey(typeof(LoginInfo).ToString()))
                        {
                            Preferences.Remove(typeof(LoginInfo).ToString());
                        }

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
                        // clear local database
                        await inspectionService.DeleteAllInProgressToPush();
                        await inspectionService.DeleteAllReportToPush();
                        await inspectionService.DeleteAllReports();
                        await inspectionService.DeleteAllUnitForm();
                        await inspectionService.DeleteAllUnitSession();
                        await inspectionService.DeleteAllWorkPlanDto();
                        await inspectionService.DeleteAllActiveInspections();
                        service.Stop();
                        await service.DeleteAllMessageListResponseDTO();
                    }



                    // return await System.Threading.Tasks.Task.FromResult(userInfo);
                    await Shell.Current.GoToAsync($"//{nameof(LoginPage)}");
                    Shell.Current.FlyoutIsPresented = false;
                    MauiProgram.SetMainDashboardPage();
                }
                
                //return await System.Threading.Tasks.Task.FromResult(userInfo);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
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