using System;
using System.ComponentModel.DataAnnotations;
using Android.Gms.Maps;
using Android.Gms.Maps.Model;
using Android.OS;
using Java.Interop;
using Microsoft.Maui.Handlers;

namespace TekTrackingCore.Handlers
{
    public partial class MapHandler : ViewHandler<MapView, Android.Gms.Maps.MapView>
    {
        private MapHelper _mapHelper;

        public List<Location> markerPositions;

        internal static Bundle Bundle { get; set; }

        public MapHandler(IPropertyMapper mapper, CommandMapper commandMapper = null) : base(mapper, commandMapper)
        {

            Console.WriteLine(mapper);
               }

        protected override Android.Gms.Maps.MapView CreatePlatformView()
        {
            return new Android.Gms.Maps.MapView(Context);
        }

        protected override void ConnectHandler(Android.Gms.Maps.MapView platformView)
        {
            base.ConnectHandler(platformView);

            _mapHelper = new MapHelper(Bundle, platformView);

            _mapHelper.MapIsReady += _mapHelper_MapIsReady;
            _mapHelper.CallCreateMap();
            
        }

        private async void _mapHelper_MapIsReady(object sender, EventArgs e)
        {
            _mapHelper.Map.UiSettings.ZoomControlsEnabled = true;
            _mapHelper.Map.UiSettings.CompassEnabled = true;
            _mapHelper.Map.UiSettings.MapToolbarEnabled = true;
            _mapHelper.Map.UiSettings.TiltGesturesEnabled   = true;
            _mapHelper.Map.UiSettings.MyLocationButtonEnabled = true;


            int x = 0;
            foreach (Location l in markerPositions) {
                x++;
                _mapHelper.Map.AddMarker(new MarkerOptions().SetPosition(new LatLng(l.Latitude, l.Longitude)).SetTitle("Marker"+x).SetSnippet("tHIS :"+x ));
               var markers= _mapHelper.Map.AddMarker(new MarkerOptions());
               

            }
            _mapHelper.Map.MoveCamera(CameraUpdateFactory.NewLatLngZoom(new LatLng(markerPositions.First().Latitude, markerPositions.First().Longitude), 18));



        }

        internal void AddLocation(Location l)
        {
            if (markerPositions == null) markerPositions = new List<Location>();
            markerPositions.Add(l);
        }
    }

    class MapHelper : Java.Lang.Object, IOnMapReadyCallback
    {
        private Bundle _bundle;
        private Android.Gms.Maps.MapView _mapView;
        

        public event EventHandler MapIsReady;

        public GoogleMap Map { get; set; }

        public MapHelper(Bundle bundle, Android.Gms.Maps.MapView mapView)
        {
            _bundle = bundle;
            _mapView = mapView;
        }

        public void CallCreateMap()
        {
            _mapView.OnCreate(_bundle);
            _mapView.OnResume();        
            _mapView.GetMapAsync(this);
        }

        public void OnMapReady(GoogleMap googleMap)
        {
            Map = googleMap;
            MapIsReady?.Invoke(this, EventArgs.Empty);
        }
    }
}

