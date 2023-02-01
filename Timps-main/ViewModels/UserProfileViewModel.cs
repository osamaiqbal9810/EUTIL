
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Newtonsoft.Json;
using TekTrackingCore.Model;
using TekTrackingCore.Services;
using TekTrackingCore.Views;

namespace TekTrackingCore.ViewModels
{
    public partial class  UserProfileViewModel:BaseViewModel
    {
        private UserProfileServices userProfileServices;

        [ObservableProperty]
        public ExtendedObservableCollection<Result> userProfile;


        [ObservableProperty]
        public string name;


        [ObservableProperty]
        public string email;

        [ObservableProperty]
        public string mobile;

        [ObservableProperty]
        public string phone;


        [ObservableProperty]
        public string hashedPassword;

        [ObservableProperty]
        public string picture;

        public UserProfileViewModel()
        {
                  userProfile = new ExtendedObservableCollection<Result>();

            var userInfo = Preferences.Get("USERDETAIL", "");
            var loginInfo = Preferences.Get(typeof(LoginInfo).ToString(),"");
            var deserialize = JsonConvert.DeserializeObject<dynamic>(userInfo);

            //var deserializeLoginInfo = JsonConvert.DeserializeObject<dynamic>(loginInfo);
            //var loginInfoData= deserializeLoginInfo.result;

              var data = deserialize.result;
            Console.WriteLine(data);
            Console.WriteLine(data);
            name=data.name;
            email=data.email;
            mobile=data.mobile;
            phone=data.phone;
            //hashedPassword = loginInfoData.hashedPassword;
           
            Console.WriteLine(data.hashedPassword);


            //userProfile.Add(abc);

        }




        [RelayCommand]
            async public void UserEdit()
            {
                await Shell.Current.GoToAsync($"//{nameof(UpdatePassword)}");
            }

        [RelayCommand]
        async public void UserSignature()
        {
            await Shell.Current.GoToAsync($"//{nameof(UserSignature)}");
        }

        [RelayCommand]
        async public void UserProfileBack()
        {
            await Shell.Current.GoToAsync($"//{nameof(Briefing)}");
        }







    }
}
