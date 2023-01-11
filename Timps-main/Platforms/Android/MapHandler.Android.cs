using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using Android.Gms.Maps;
using Android.Gms.Maps.Model;
using Android.OS;
using Java.Interop;
using Microsoft.Maui.Handlers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using TekTrackingCore.Framework;
using TekTrackingCore.Sample.Models;
using TekTrackingCore.Services;
using TekTrackingCore.ViewModels;

namespace TekTrackingCore.Handlers
{
    
    public partial class MapHandler : ViewHandler<MapView, Android.Gms.Maps.MapView>
    {
        public List<WorkPlanDto> workPlanList = new List<WorkPlanDto>();
        private MapHelper _mapHelper;

        public List<Location> markerPositions;

        public ObservableCollection<Unit> units { get; set; }


        //public List<WorkPlanDto> units { get; set; }

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
            units = new ObservableCollection<Unit>();
            DatabaseSyncService service = ServiceResolver.ServiceProvider.GetRequiredService<DatabaseSyncService>();

          var filterdlist = (service.staticListItemDTOs.Where(p => p.ListName == "WorkPlanTemplate").Take(100));
            foreach (var listItems in filterdlist)
            {
                
                var item = listItems.OptParam1;

                var jsonSettings = new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore,
                    MissingMemberHandling = MissingMemberHandling.Ignore,
                };

                WorkPlanDto result = JsonConvert.DeserializeObject<WorkPlanDto>(item, jsonSettings); // jsonSettings are explicitly supplied
                workPlanList.Add(result);
                Console.WriteLine(result);

                units.AddRange(result.AllUnits);
                break;
            }
            // var filter=  filterdlist.FirstOrDefault();

            int x = 0;
            
            

            foreach (Unit l in units) {
                x++;
                if (l != null)
                {
                    double[] v = l.Coordinates[0];
                    //Array item = v.ToObject<Array>();
                    double lat1 = v[0];
                    double long1 = v[1];

                   // var locationx=v as Array;
                    var location2 = v;
                }

                _mapHelper.Map.AddMarker(new MarkerOptions().SetPosition(new LatLng((double) 2, (double)3)).SetTitle("Marker"+x).SetSnippet("tHIS :"+x ));
               
               

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

