using TekTrackingCore.Model;
using TekTrackingCore.ViewModels;
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;

namespace TekTrackingCore.Views;

public partial class LoginPage : ContentPage
{
    public LoginPage()
    {
        InitializeComponent();

     




    }
    public LoginPage(LoginViewModel vm)
    {
        InitializeComponent();
       
        this.BindingContext = vm;
        vm.showLoading = setSpinner;
        vm.emailStatus = setStatusCode;
        
        // whenever log out is clicked from side bar , this will check if user info is already set it will remove it from preferences to logout user.
        if (Preferences.ContainsKey(typeof(LoginInfo).ToString()))
        {
            Preferences.Remove(typeof(LoginInfo).ToString());
        }
    }

    public void setSpinner(bool value)
    {
        var spinner = FindByName("loadingSpinner") as ActivityIndicator;
        spinner.IsRunning = value;
        spinner.Color = Colors.DarkBlue;

    }



    public async void  setStatusCode (string value , bool show)
    {
      
        if (show == true)
        {
            CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();
            var toast = Toast.Make(value, ToastDuration.Long);
            var spinner = FindByName("loadingSpinner") as ActivityIndicator;
            spinner.IsRunning = false;
            toast.Show();
          
        }

     

        //var status = FindByName("status") as Label;
        //status.Text = value;
        //status.IsVisible= show;

      



    }


   

    protected override void OnDisappearing()
    {
        Unfocus();
        base.OnDisappearing();
        Platforms.KeyboardHelper.HideKeyboard();

    }
}

