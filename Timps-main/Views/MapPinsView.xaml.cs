
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;
using CommunityToolkit.Maui.Views;
using Microsoft.Maui.Controls.Maps;
using Microsoft.Maui.Layouts;
using Microsoft.Maui.Maps;
using Syncfusion.Maui.Data;
using System.Collections.Generic;
using System.Net.NetworkInformation;
using TekTrackingCore.Framework;
using TekTrackingCore.Sample.Models;
using TekTrackingCore.Services;
using TekTrackingCore.ViewModels;

namespace TekTrackingCore.Views;

public partial class MapPinsView : ContentPage
{
    private CancellationTokenSource _cancelTokenSource;
    public dynamic status { get; set; }
    public StaticListItemViewModel staticListItemViewModel;
    public InspectionService inspectionService;
    public IDispatcherTimer timer { get; set; }
    public List<Unit> selectedUnits;
    public List<Unit> AllUnits;
    DatabaseSyncService service;

    public MapPinsView(MapViewModel vm)
    {
        InitializeComponent();
        selectedUnits = new List<Unit>();
        AllUnits = new List<Unit>();
        this.BindingContext = vm;
        vm.uniqueArrayList = uniqueArray;
        vm.AllUnitsArrList = AllUnitArray;
        service = ServiceResolver.ServiceProvider.GetRequiredService<DatabaseSyncService>();
        status = vm.positions;
        inspectionService = new InspectionService();
        staticListItemViewModel = new StaticListItemViewModel(inspectionService);
        timer = Application.Current.Dispatcher.CreateTimer();
        timer.Interval = TimeSpan.FromSeconds(10);

        timer.Tick += async (s, e) =>
        {
            try
            {
                AllUnits.Clear();
                selectedUnits.Clear();
                GeolocationRequest request = new GeolocationRequest(GeolocationAccuracy.Medium, TimeSpan.FromSeconds(10));

                _cancelTokenSource = new CancellationTokenSource();

                Location location = await Geolocation.Default.GetLocationAsync(request, _cancelTokenSource.Token);
                MapSpan mapSpan = MapSpan.FromCenterAndRadius(location, Distance.FromKilometers(0.444));
                map.MoveToRegion(mapSpan);
                vm.updatePinsBasedOnCurrentLocation(location);
            }
            catch (Exception ex)
            {
                var toast = Toast.Make("Location service is not enabled!. Turn on device location to continue using map.", ToastDuration.Long);
                await toast.Show();
                timer.Stop();
            }

        };
        timer.Start();

    }

    protected override void OnAppearing()
    {
        base.OnAppearing();

        // staticListItemViewModel.checkWpList();

    }
    public void uniqueArray(Unit unit)
    {
        selectedUnits.Add(unit);
    }

    public void AllUnitArray(Unit unit)
    {
        AllUnits.Add(unit);
    }
    private async void Pin_MarkerClicked(object sender, PinClickedEventArgs e)
    {
        string statusColor = default;
        CustomPin selectedAsset = (CustomPin)sender;
        string assetId = default;
        string assetStatus = default;
        string assetypes = default;

        foreach (var unit in selectedUnits)
        {


            if (unit.AssetId == selectedAsset.UnitId)
            {
                assetId = unit.UnitId;
                assetStatus = unit.Status;
                assetypes = unit.AssetType;

                if (assetStatus == "Finished")
                {
                    statusColor = "#008000";
                }

                else if (assetStatus == "In Progress" || assetStatus == "Upcoming" || assetStatus == "Overdue")
                {
                    statusColor = "#FF0000";
                }

                else if (assetStatus == "Not-Located")
                {
                    statusColor = "#FFFF00";
                }
            }
        }

        StackLayout hr = new StackLayout();








        Label label1 = new Label { FontSize = 20, FontAttributes = FontAttributes.Bold, TextColor = Color.FromRgb(205, 92, 92) };
        Label label2 = new Label { FontSize = 16, FontAttributes = FontAttributes.Bold, TextColor = Color.FromRgb(255, 255, 255) };
        Label label3 = new Label { FontSize = 20, FontAttributes = FontAttributes.Bold };
        Label label4 = new Label { FontSize = 16, FontAttributes = FontAttributes.Bold, TextColor = Color.FromRgb(255, 255, 255), Margin = new Thickness(0, 4, 0, 0) };
        Label label5 = new Label { FontSize = 20, FontAttributes = FontAttributes.Bold, Text = "Asset Name", Margin = new Thickness(0, 0, 0, 0) };
        Label label6 = new Label { FontSize = 20, FontAttributes = FontAttributes.Bold, Text = "Asset Type", Margin = new Thickness(0, 16, 0, 0) };

        Frame frame = new Frame
        {
            WidthRequest = 10,
            HeightRequest = 10,
            CornerRadius = 100,
            Margin = new Thickness(0, 0, 0, 0),
            BackgroundColor = Color.FromHex(statusColor)

        };


        label2.Text = assetId;
        label3.Text = assetStatus;
        label4.Text = assetypes;
        //flex.Add(border1);

        FlexLayout flex = new FlexLayout();

        flex.HeightRequest = 30;
        flex.JustifyContent = FlexJustify.SpaceBetween;
        flex.AlignItems = FlexAlignItems.Center;




        hr.Children.Add(label5);
        flex.Children.Add(label2);
        flex.Children.Add(frame);

        Border border1 = new Border
        {
            Stroke = Color.FromArgb("#C49B33"),
            Background = Color.FromArgb("#7393B3"),
            StrokeThickness = 2,
            Padding = new Thickness(10, 4),
            WidthRequest = 315,
            HorizontalOptions = LayoutOptions.Center,
            VerticalOptions = LayoutOptions.Center,

            Content = new VerticalStackLayout
            {
                flex
            }
        };

        Border border2 = new Border
        {
            Stroke = Color.FromArgb("#C49B33"),
            Background = Color.FromArgb("#7393B3"),
            StrokeThickness = 2,
            Padding = new Thickness(10, 4),

            WidthRequest = 315,
            HeightRequest = 42,
            HorizontalOptions = LayoutOptions.Center,


            Content = new HorizontalStackLayout
            {
                label4,

            }
        };

        hr.Children.Add(border1);
        hr.Children.Add(label6);
        hr.Children.Add(border2);

        hr.Spacing = 5;
        hr.HeightRequest = 350;
        hr.WidthRequest = 320;
        hr.Padding = 10;
        Popup popup = new Popup();



        foreach (var unit in AllUnits)
        {
            if (unit.AssetId == selectedAsset.UnitId)
            {
                Button button1 = new Button { Text = "Go to Inspection -" + unit.InspectionType, HorizontalOptions = LayoutOptions.CenterAndExpand, HeightRequest = 50, WidthRequest = 300, Margin = new Thickness(0, 20, 0, 0), CornerRadius = 0, FontAttributes = FontAttributes.Bold, Background = Color.FromArgb("#002D62") };
                button1.FontSize = 20;
                button1.CornerRadius = 50;
                //button1.shadow;
                button1.Clicked += async (sender, args) => goToInspection(sender, args, popup);

                hr.Children.Add(button1);

            }
        }

        ScrollView scrollView = new ScrollView
        {
            Margin = new Thickness(20),
            Content = hr
        };

        popup.Content = scrollView;
        this.ShowPopup(popup);
    }

    public async void goToInspection(dynamic abc, dynamic xyz, Popup popup)
    {

        var navigationParameter = new Dictionary<string, object>
    {
        { "selectedUnits", selectedUnits }
    };

        await Shell.Current.GoToAsync($"//{nameof(ExpandableView)}", navigationParameter);
        popup.Close();
    }

}