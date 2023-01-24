using TekTrackingCore.Model;
using TekTrackingCore.ViewModels;
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;
using TekTrackingCore.Services;

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
        NavigationPage.SetHasNavigationBar(this, false);
        this.BindingContext = vm;
        vm.showLoading = setSpinner;
        vm.emailStatus = setStatusCode;
        
    }
    public void setSpinner(bool value)
    {
        var spinner = FindByName("loadingSpinner") as ActivityIndicator;
        spinner.IsRunning = value;
        spinner.Color = Colors.DarkBlue;
    }
    public async void setStatusCode(string value, bool show)
    {
        if (show == true)
        {
            var toast = Toast.Make(value, ToastDuration.Long);
            var spinner = FindByName("loadingSpinner") as ActivityIndicator;
            spinner.IsRunning = false;
            await toast.Show();
        }
    }

    protected override void OnDisappearing()
    {
        Unfocus();
        base.OnDisappearing();
        //Platforms.KeyboardHelper.HideKeyboard();
    }
}