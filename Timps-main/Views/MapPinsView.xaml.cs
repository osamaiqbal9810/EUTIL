
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;
using CommunityToolkit.Maui.Views;
using Microsoft.Maui.Controls.Maps;
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
            catch(Exception ex)
            {
                var toast = Toast.Make("Location service is not enabled!. Turn on device location to continue using map.", ToastDuration.Long);
                await toast.Show();
                timer.Stop();
            }
            timer.Start();

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
        HorizontalStackLayout flex = new HorizontalStackLayout();

        Label label1 = new Label { FontSize = 20, FontAttributes = FontAttributes.Bold, TextColor = Color.FromRgb(205, 92, 92) };
        Label label2 = new Label { FontSize = 20, FontAttributes = FontAttributes.Bold };
        Label label3 = new Label { FontSize = 20, FontAttributes = FontAttributes.Bold };
        Label label4 = new Label { FontSize = 20, FontAttributes = FontAttributes.Bold };
        Frame frame = new Frame
        {
            WidthRequest = 10,
            HeightRequest = 10,
            CornerRadius = 100,
            Margin = new Thickness(170, 0, 0, 0),
            BackgroundColor = Color.FromHex(statusColor)
        };

        label2.Text = assetId;
        label3.Text = assetStatus;
        label4.Text = assetypes;

        flex.Children.Add(label2);
        flex.Children.Add(frame);
        hr.Children.Add(flex);
        hr.Children.Add(label4);

        hr.Spacing = 5;
        hr.HeightRequest = 300;
        hr.WidthRequest = 370;
        hr.Padding = 10;
        Popup popup = new Popup();

        foreach (var unit in AllUnits)
        {
            if (unit.AssetId == selectedAsset.UnitId)
            {
                HorizontalStackLayout flexbtn = new HorizontalStackLayout();
                {
                    Button button1 = new Button { Text = "Go to Inspection -" + unit.InspectionType, HorizontalOptions = LayoutOptions.Start, HeightRequest = 50, WidthRequest = 280, Margin = new Thickness(0, 20, 0, 0), CornerRadius = 0, FontAttributes = FontAttributes.Bold };
                    button1.Clicked += async (sender, args) => goToInspection(sender, args, popup);

                    flexbtn.Children.Add(button1);
                    hr.Children.Add(flexbtn);
                }
            }
        }
        popup.Content = hr;
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