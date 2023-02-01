using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
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


    public partial class MapViewModel : BaseViewModel
    {

        [ObservableProperty]
        public ExtendedObservableCollection<WorkPlanDto> workPlanList;

        [ObservableProperty]
        public ExtendedObservableCollection<Positions> positions;
        public Action<Unit> uniqueArrayList { get; set; }
        public Action<Unit> AllUnitsArrList { get; set; }


        DatabaseSyncService service;
        //public  List<Location> pins;
        StaticListItemViewModel staticListItemViewModel;
        InspectionService inspectionService;

        public MapViewModel()
        {
            positions = new ExtendedObservableCollection<Positions>();
            workPlanList = new ExtendedObservableCollection<WorkPlanDto>();
            service = ServiceResolver.ServiceProvider.GetRequiredService<DatabaseSyncService>();
            service.Start();
            inspectionService = new InspectionService();
            staticListItemViewModel = new StaticListItemViewModel(inspectionService);
            staticListItemViewModel.checkWpList();

        }


        public async void updatePinsBasedOnCurrentLocation(Location userLocation)
        {
            var tempArrayUnits = new List<Unit>();
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

                    var findPlan = workPlanList.Where(p => p.Id == result.Id).Take(100).FirstOrDefault();
                    if (findPlan == null)
                    {
                        workPlanList.Add(result);
                    }
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
                            //var coordinatesArray = unit.Coordinates[0];
                            tempArrayUnits.Add(unit);

                        }
                    }
                }
            }

            var uniqueUnitsArr = new List<Unit>();


            foreach (var temp in tempArrayUnits)
            {

                var result = uniqueUnitsArr.Find(unique => unique.AssetId == temp.AssetId);
                if (result == null)
                {
                    uniqueUnitsArr.Add(temp);
                    uniqueArrayList(temp);
                }
                AllUnitsArrList(temp);

            }

            foreach (var unit in uniqueUnitsArr)
            {

                var coordinates = unit.Coordinates[0];

                Location location = new Location(coordinates[1], coordinates[0]);
                Positions ps = new Positions();
                Distance calculateddistance = Distance.BetweenPositions(userLocation, location);
                if (calculateddistance.Kilometers < counfigureddistanceinkilometer.Kilometers)
                {
                    ps.UnitId = unit.AssetId;
                    ps.Description = unit.UnitId;
                    ps.Status = unit.Status;
                    ps.Location = location;
                    if (unit.Status == "Finished")
                    {
                        ps.markerImg = ImageSource.FromFile("greenmarker.png");
                    }
                    else if (unit.Status == "In Progress" || unit.Status == "Upcoming" || unit.Status == "Overdue")
                    {
                        ps.markerImg = ImageSource.FromFile("redmarker.png");
                    }

                    positions.Add(ps);
                   
                }

            };

        }

        [RelayCommand]
        public void PinClicked(Positions map)
        {

        }
    }






}
