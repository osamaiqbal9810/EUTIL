using CommunityToolkit.Mvvm.ComponentModel;
using Microsoft.Maui.Maps;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Framework;
using TekTrackingCore.Models;
using TekTrackingCore.Sample.Models;
using TekTrackingCore.Services;

namespace TekTrackingCore.ViewModels
{

      
public partial  class MapViewModel : BaseViewModel, INotifyPropertyChanged
    {

        [ObservableProperty]
        public ExtendedObservableCollection<WorkPlanDto> workPlanList;

        [ObservableProperty]
        public ExtendedObservableCollection<Positions> positions;
        DatabaseSyncService service;
        //public  List<Location> pins;


        public MapViewModel()
        {
            positions = new ExtendedObservableCollection<Positions>();

            workPlanList = new ExtendedObservableCollection<WorkPlanDto>();
            service = ServiceResolver.ServiceProvider.GetRequiredService<DatabaseSyncService>();
        }
        public async void updatePinsBasedOnCurrentLocation(Location userLocation)
        {
            var pullList = await service.GetMessageListResponseDTO();
            var filterdlist = (pullList.Where(p => p.ListName == "WorkPlanTemplate").Take(100));
             //var filterdlist = (service.staticListItemDTOs.Where(p => p.ListName == "WorkPlanTemplate").Take(100));
            foreach (var listItems in filterdlist)
            {
                if (listItems.Code != "-1")
                {
                    var item = listItems.OptParam1;

                    var jsonSettings = new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore,
                        MissingMemberHandling = MissingMemberHandling.Ignore,
                    };

                    WorkPlanDto result = JsonConvert.DeserializeObject<WorkPlanDto>(item, jsonSettings); // jsonSettings are explicitly supplied
                    workPlanList.Add(result);
                }

            }
            positions.Clear();
            Distance counfigureddistanceinkilometer = Distance.FromKilometers(1);
            
            foreach (var wp in workPlanList)
            {

                var allUnits = wp.AllUnits;
                if (allUnits.Count() > 0)
                {
                    foreach (var unit in allUnits)
                    {
                        if (unit.Coordinates.Count() > 0)
                        {
                            var coordinatesArray = unit.Coordinates[0];
                            Location location = new Location(coordinatesArray[1], coordinatesArray[0]);
                            Positions ps = new Positions();
                            Distance calculateddistance = Distance.BetweenPositions(userLocation, location);
                            if (calculateddistance.Kilometers < counfigureddistanceinkilometer.Kilometers)
                            {
                                //ps.Address = "Address";
                                ps.Description = unit.UnitId;
                                ps.Status = unit.Status;
                                ps.Location = location;


                                positions.Add(ps);
                            }
                        }
                    }
                }
            }
        }
    }
   
        
       


   
}
