using CommunityToolkit.Mvvm.ComponentModel;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Models;
using TekTrackingCore.Services;

namespace TekTrackingCore.ViewModels
{
    public partial class BaseViewModel : ObservableObject, INotifyPropertyChanged
    {
        [ObservableProperty]
        [NotifyPropertyChangedFor(nameof(IsNotBusy))]
        private bool isBusy;

        [ObservableProperty]
        private string title;

        [ObservableProperty]
        public bool isNotConnected;
        public bool IsNotBusy => !IsBusy;
        public InspectionService inspectionService;
        public bool connectivityFlag  = false;
        public BaseViewModel()
        {
           inspectionService = new InspectionService();
           Connectivity.ConnectivityChanged += Connectivity_ConnectivityChanged;
           Preferences.Set("Network_State", "Not-Connected");
           isNotConnected = Connectivity.NetworkAccess != NetworkAccess.Internet;
            
            
        }

        void Connectivity_ConnectivityChanged(object sender, ConnectivityChangedEventArgs e)
        {
            var getState = Preferences.Get("Network_State", "");
            if(e.NetworkAccess == NetworkAccess.Internet )
            {
                if(getState != "Connected")
                {
                    inspectionService.pushReportsToServer();
                    isNotConnected = false;
                }
                Preferences.Set("Network_State", "Connected");  
            }else
            {
                isNotConnected = true;
                Preferences.Set("Network_State", "Not-Connected");
            }
        }
    }
}
