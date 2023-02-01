using CommunityToolkit.Maui.Markup;
using System.Collections.ObjectModel;
using TekTrackingCore.Model;
using TekTrackingCore.Services;
using TekTrackingCore.Views;

namespace TekTrackingCore;

public partial class App : Application
{
    public static LoginInfo CurrentUserDetails { get; internal set; }
    public App()
    {
        InitializeComponent();
        Application.Current.UserAppTheme = AppTheme.Light;
       
        MainPage = new AppShell();

  
    }
}

