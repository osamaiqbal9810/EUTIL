using TekTrackingCore.Model;
using TekTrackingCore.Views;

namespace TekTrackingCore;

public partial class App : Application
{
    public static LoginInfo CurrentUserDetails { get; internal set; }
    public App()
    {
        InitializeComponent();

        MainPage = new AppShell();
        //MainPage = new MainPage();
    }
}
