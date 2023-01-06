using CommunityToolkit.Maui.Markup;
using System.Collections.ObjectModel;
using TekTrackingCore.Handlers;
using TekTrackingCore.Model;
using TekTrackingCore.Views;

namespace TekTrackingCore;

public partial class App : Application
{
    public static LoginInfo CurrentUserDetails { get; internal set; }
    public App()
    {
        InitializeComponent();
        Application.Current.UserAppTheme = AppTheme.Light;
        //DeviceDisplay.KeepScreenOn = true;



        MainPage = new AppShell();

        //MainPage = new MapPage();


        Microsoft.Maui.Handlers.ViewHandler.ElementMapper.Add(nameof(IView), (handler, view) =>
        {
            if (view is MapView)
            {
#if ANDROID
                MapHandler x = handler as MapHandler;
                MapView view1 = view as MapView;
                foreach(Location l in view1.markerPositions)
                {
                    x.AddLocation(l);
                }
                
                x.Invoke("Test", new object());


#endif
            }
        });

    }
}

public class MapPage : ContentPage
{
    public MapView mapView { get; set; }

    public MapPage()
    {
        mapView = new MapView();
        mapView.markerPositions = new List<Location>();
        mapView.markerPositions.Add(new Location(31.614631, 74.383153));
        mapView.markerPositions.Add(new Location(31.614231, 74.385153));
        mapView.markerPositions.Add(new Location(31.614201, 74.382153));
        
        mapView.markerPositions.Add(new Location(31.611631, 74.383153));


           Content = mapView;

        Button button = new Button
        {
            Text = "clickme",
            VerticalOptions = LayoutOptions.Center,
            HorizontalOptions = LayoutOptions.Center
        };

 



    }
}
