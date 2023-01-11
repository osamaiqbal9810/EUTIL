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

namespace TekTrackingCore.ViewModels
   
{
    public partial class SettingViewModelcs:BaseViewModel
    {
        public ObservableCollection<SettingModel>Settings { get; set; } = new ObservableCollection<SettingModel>();
        private readonly IStudentService _studentService;
        public SettingViewModelcs(IStudentService studentService) { 
             _studentService=studentService;
        }
        //SettingModel settingModel = new SettingModel();

        [RelayCommand]
        public async Task<List<SettingModel>> ReadSettingsDetails()
        {
            var list = await _studentService.ReadSettingsDetails();

            if (list?.Count() > 0)
            {
                Settings.Clear();
                foreach (var item in list)
                {
                    Settings.Add(item);
                    Preferences.Set("serverEndpoint",item.ServerAdress+":"+item.PortNumber);
                }
                
            }

            return list;
          
        }

        [RelayCommand]
        public async void DeleteServer(SettingModel settingModel)
        {
            var delResponse = await _studentService.DeleteServer(settingModel);

            Preferences.Clear();

            if (delResponse > 0)
            {
                ReadSettingsDetails();
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
                   bool res = x.checkStatusTrue();
                    Console.WriteLine(res);
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
