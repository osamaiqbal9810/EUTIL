
using CommunityToolkit.Maui.Views;
using Microsoft.Maui.Controls.Maps;
using Microsoft.Maui.Maps;
using Syncfusion.Maui.Data;
using System.Collections.Generic;
using System.Net.NetworkInformation;
using TekTrackingCore.ViewModels;

namespace TekTrackingCore.Views;

public partial class MapPinsView : ContentPage
{

    public dynamic status { get; set; }

    public IDispatcherTimer timer { get; set; }


public MapPinsView(MapViewModel vm)
	{
		InitializeComponent();
		this.BindingContext= vm;
        status = vm.positions;

    timer = Application.Current.Dispatcher.CreateTimer();
    timer.Interval = TimeSpan.FromSeconds(10);
        
        timer.Tick += async (s, e) =>
        {
            
            Location location = await Geolocation.Default.GetLastKnownLocationAsync();
            MapSpan mapSpan = MapSpan.FromCenterAndRadius(location, Distance.FromKilometers(0.444));
            map.MoveToRegion(mapSpan);

            vm.updatePinsBasedOnCurrentLocation(location);
        };
    timer.Start();
       
}

  

    private void Pin_MarkerClicked(object sender, PinClickedEventArgs e)
    {
        var pinsVal = sender as Pin;
        var label = pinsVal.Label;

        Label label1 = new Label { FontSize = 20, FontAttributes = FontAttributes.Bold, TextColor = Color.FromRgb(205, 92, 92) };
        Label label2 = new Label { FontSize = 20, FontAttributes = FontAttributes.Bold };

        Button button = new Button { Text = "Go to Inspection", HorizontalOptions = LayoutOptions.Start, HeightRequest = 50, Margin = new Thickness(0, 60, 0, 0), CornerRadius = 0, FontAttributes = FontAttributes.Bold };
        Label label4 = new Label { FontSize = 20, FontAttributes = FontAttributes.Bold };

        label1.Text = "Name :";
        label2.Text = label;
        button.Text = "Go to Inspection";

       

        //foreach (var abc in status)
        //{
        //    label4.Text = abc.Status.ToString();
          

        //}



        if (label != null)
        {


            StackLayout hr = new StackLayout();
            hr.Children.Add(label1);
            hr.Children.Add(label2);

            hr.Children.Add(label4);
            //hr.Children.Add(label3);
            hr.Spacing = 5;
            hr.Children.Add(button);
            hr.HeightRequest = 250;
            hr.WidthRequest = 300;
            hr.Padding = 10;

            Popup popup = new Popup();
            popup.Content = hr;
         
            this.ShowPopup(popup);

          
        }

    }
}