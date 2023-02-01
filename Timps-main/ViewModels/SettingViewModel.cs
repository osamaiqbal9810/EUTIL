using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Models;
using TekTrackingCore.Services;
using TekTrackingCore.Views;
namespace TekTrackingCore.ViewModels
{
    public partial class SettingViewModelcs : BaseViewModel
    {
        bool res;
        public ObservableCollection<SettingModel> Settings { get; set; } = new ObservableCollection<SettingModel>();
        private readonly ISettingServerServices _settingServerServices;
        public SettingViewModelcs(ISettingServerServices settingServerServices)
        {
            _settingServerServices = settingServerServices;
        }
        //SettingModel settingModel = new SettingModel();
        [RelayCommand]
        public async Task<List<SettingModel>> ReadSettingsDetails()
        {
            var list = await _settingServerServices.ReadSettingsDetails();
            if (list?.Count() > 0)
            {
                Settings.Clear();
                foreach (var item in list)
                {
                    Settings.Add(item);
                    //Preferences.Set("serverEndpoint", item.ServerAdress + ":" + item.PortNumber);
                }
            }
            return list;
        }
        [RelayCommand]
        public async void DeleteServer(SettingModel settingModel)
        {
            bool response = await App.Current.MainPage.DisplayAlert("Are you sure ?", "Do you really want to delete this Server ?", "Delete", "Cancel");
            if (response == true)
            {
                var delResponse = await _settingServerServices.DeleteServer(settingModel);

                //await Shell.Current.GoToAsync(nameof(Setting));
                var page = Application.Current.MainPage.Navigation.NavigationStack.LastOrDefault();
                // Load new page
                await Shell.Current.GoToAsync(nameof(Setting), false);
                Application.Current.MainPage.Navigation.RemovePage(page);
               
                if (Preferences.Default.ContainsKey("serverEndpoint")){
                    
                    Preferences.Remove("serverEndpoint");
                }
                if (delResponse > 0)
                {
                    ReadSettingsDetails();
                }
            }
        }
        [RelayCommand]
        public async void SettingCheck(SettingModel settingModel)
        {
            var allSettings = await ReadSettingsDetails();
            allSettings.ForEach(x =>
            {
                if (settingModel.UserId == x.UserId)
                {
                    Console.WriteLine("checked");
                    res = x.checkStatusTrue();
                    Console.WriteLine(res);
                    Preferences.Set("serverEndpoint", settingModel.ServerAdress + ":" + settingModel.PortNumber);
                }
                else
                {
                    //settingModel.isCheckedOrNot = false;
                    x.checkStatusFalse();
                }
            });
        }
    }
}








