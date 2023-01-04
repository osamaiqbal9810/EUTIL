﻿


using CommunityToolkit.Mvvm.ComponentModel;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Framework;
using TekTrackingCore.Services;

namespace TekTrackingCore.ViewModels
{

    public partial class BriefingViewModel : BaseViewModel
    {
        private CancellationTokenSource _cancelTokenSource;
        private bool _isCheckingLocation;
        public InspectionService inspectionService = new InspectionService();
        public int Reported { get; set; }
        // public int Session { get; set; }
        public string Times { get; set; }

        [ObservableProperty]
        public string session;

        [ObservableProperty]
        public string activeInspection;

        [ObservableProperty]
        public string latitude;

        [ObservableProperty]
        public string longitude;

        [ObservableProperty]
        public string locationInfo;


        public void SetBriefingViewModel(int reported, int session, string times)
        {
            Reported = reported;
            //Session = session;
            Times = times;
        }
        public BriefingViewModel()
        {
            DatabaseSyncService service = ServiceResolver.ServiceProvider.GetRequiredService<DatabaseSyncService>();
            service.Start();

            GetCurrentLocation();
            SetSesssion();
            SetActiveInspection();
        }
        public async Task SetSesssion()
        {
            var sessionedWorkPlanes = await inspectionService.GetWorkPlanDtos();
            Session = sessionedWorkPlanes.Count.ToString();
            Console.WriteLine(sessionedWorkPlanes.Count);
        }

        public async Task SetActiveInspection()
        {
            var activeInspections = await inspectionService.GetActiveInspections();
            if(activeInspections.Count > 0)
            {
                ActiveInspection = activeInspections[0].Title;
            }
            else
            {
                ActiveInspection = "No Active Inspection";
            }

            Console.WriteLine(activeInspections);
        }

        public async Task GetCurrentLocation()
        {
            try
            {
                _isCheckingLocation = true;

                GeolocationRequest request = new GeolocationRequest(GeolocationAccuracy.Medium, TimeSpan.FromSeconds(10));

                _cancelTokenSource = new CancellationTokenSource();

                Location location = await Geolocation.Default.GetLocationAsync(request, _cancelTokenSource.Token);


                if (location != null)
                {
                    Console.WriteLine($"Latitude: {location.Latitude}, Longitude: {location.Longitude}, Altitude: {location.Altitude}");
                    Latitude = location.Latitude.ToString();
                    Longitude = location.Longitude.ToString();
                    var locationInfoObj = await GetGeocodeReverseData(location.Latitude, location.Longitude);
                    LocationInfo = locationInfoObj;


                }
            }

            catch (Exception ex)
            {
                // Unable to get location
            }
            finally
            {
                _isCheckingLocation = false;
            }
        }

        private async Task<string> GetGeocodeReverseData(double latitude, double longitude)
        {
            IEnumerable<Placemark> placemarks = await Geocoding.Default.GetPlacemarksAsync(latitude, longitude);

            Placemark placemark = placemarks?.FirstOrDefault();

            if (placemark != null)
            {
                return
                    $"{placemark.CountryName}," + $" {placemark.AdminArea}," + $" {placemark.Locality}," + $" {placemark.FeatureName} " + $" {placemark.SubLocality}";

            }

            return "";
        }

    }
}
