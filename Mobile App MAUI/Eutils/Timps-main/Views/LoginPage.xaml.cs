using TekTrackingCore.Model;
using TekTrackingCore.ViewModels;

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
        // whenever log out is clicked from side bar , this will check if user info is already set it will remove it from preferences to logout user.
        if (Preferences.ContainsKey(typeof(LoginInfo).ToString()))
        {
            Preferences.Remove(typeof(LoginInfo).ToString());
        }
    }
}