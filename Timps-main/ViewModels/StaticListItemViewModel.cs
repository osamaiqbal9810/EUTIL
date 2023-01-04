

using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Maui.ApplicationModel.Communication;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Syncfusion.Maui.Data;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Framework;
using TekTrackingCore.Framework.Types;
using TekTrackingCore.Interfaces;
using TekTrackingCore.Model;
using TekTrackingCore.Models;
using TekTrackingCore.Repositry;
using TekTrackingCore.Sample.Models;
using TekTrackingCore.Services;
using System.Threading.Tasks;


namespace TekTrackingCore.ViewModels
{
    public static class LinqExtensions
    {
        public static ICollection<T> AddRange<T>(this ICollection<T> source, IEnumerable<T> addSource)
        {
            foreach (T item in addSource)
            {
                source.Add(item);
            }

            return source;
        }
    }
    public class ExtendedObservableCollection<T> : ObservableCollection<T>
    {
        public void Execute(Action<IList<T>> itemsAction)
        {
            itemsAction(Items);
            OnCollectionChanged(new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Reset));
        }
    }
    public partial class StaticListItemViewModel : BaseViewModel, INotifyPropertyChanged
    {
        [ObservableProperty]
        public ExtendedObservableCollection<StaticListItemDTO1> staticListItemsList;


        [ObservableProperty]
        public ExtendedObservableCollection<StaticListItemDTO1> staticListItemsList1;

        [ObservableProperty]
        public ExtendedObservableCollection<WorkPlanDto> workPlanList;


        private DatabaseSyncService service;
        private InspectionService inspectionService;
       
        public StaticListItemViewModel()
        {
            service = ServiceResolver.ServiceProvider.GetRequiredService<DatabaseSyncService>();
            StaticListItemsList = new ExtendedObservableCollection<StaticListItemDTO1>();
            StaticListItemsList1 = new ExtendedObservableCollection<StaticListItemDTO1>();
            workPlanList = new ExtendedObservableCollection<WorkPlanDto>();
            inspectionService = new InspectionService();
            //staticListItemsList.Add(new StaticListItemDTO1 { Code = "666", Description = "555", ListName = "444", OptParam1 = "3333", OptParam2 = "33", TenantId = "123" });
            service.SetSyncCallback = onSyncCallback;
          
        }
       

        [RelayCommand]
        public async void Test(Sample.Models.Unit unit)
        {
            if (unit != null)
            {
                string testCode = unit.TestForm[0].TestCode.ToString();
                var selectedWorkPlan = workPlanList.Where(p => p.Id == unit.WPlanId);

                var jsonSettings = new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore,
                    MissingMemberHandling = MissingMemberHandling.Ignore
                };

                string result = JsonConvert.SerializeObject(selectedWorkPlan, jsonSettings);
                string unitObj = JsonConvert.SerializeObject(unit, jsonSettings);
                System.Diagnostics.Debug.WriteLine(result);
                //Console.WriteLine(filterdlist.ToString(), "filteredlist");
              OnSyncCallback1(testCode, result, unitObj);

            }
        }

        [RelayCommand]
        public async void StartInspection(WorkPlanDto obj)
        {
            await inspectionService.SetUpDb();
            // prepare data for session table
            SessionModel sm = new SessionModel();
            sm.Title = obj.Title;
            sm.Id = obj.Id;
            
            
            if (obj != null)
            {
                bool response = await App.Current.MainPage.DisplayAlert("Are you sure ?", "Do you really want to "+ obj.msg + " this Inspection", "OK", "Cancel");
                if (response == true)
                {
                    var activeInspections = await inspectionService.GetActiveInspections();
                    if (activeInspections.Count > 0)
                    {
                        foreach (var plan in workPlanList)
                        {
                            if (obj.Id != plan.Id)
                            {
                                plan.inspectionBtnStatus = false;
                                if (plan.msg != "start" && plan.msg != "Resume") {
                                    plan.start();
                                    
                                }
                                var OtherAssetsAllUnits = plan.AllUnits;
                                foreach (var otherUnit in OtherAssetsAllUnits)
                                {
                                    otherUnit.StartInspButtonStatus = false;
                                }
                            }
                            
                        }
                    }
                    ActiveInspections active = new ActiveInspections();
                    active.Title = obj.Title;
                    active.Id = obj.Id;

                    var units = obj.AllUnits;
                    foreach (var unit in units)
                    {
                        unit.StartInspButtonStatus = true;
                    }
                    if (obj.msg == "start")
                    {
                       
                        await inspectionService.AddWorkPlanDto(sm);
                        // prepare data for ActiveInspection
                        await inspectionService.AddActiveInspection(active);
                        string nextState = obj.start();
                        sm.startInspBtnState = nextState;
                        await inspectionService.UpdateWorkPlanDto(sm);
                        foreach (var plan in workPlanList)
                        {
                            if (obj.Id != plan.Id)
                            {
                                plan.inspectionBtnStatus = false;

                            }
                            
                        }
                        await SendInprogressResponseToServer(obj);
                    }

                    else if(obj.msg == "pause")
                    {
                        string nextState = obj.pause();
                        sm.startInspBtnState = nextState;
                       await  inspectionService.UpdateWorkPlanDto(sm);
                        foreach (var unit in units)
                        {
                            Console.WriteLine(unit.AssetId);
                            unit.StartInspButtonStatus = false;
                        }

                        foreach (var plan in workPlanList)
                        {
                            plan.inspectionBtnStatus = true;

                        }
                        await inspectionService.DeleteActiveInspection(active);
                    }
                    else if(obj.msg == "Resume")
                    {
                        string msg = obj.start();
                        sm.startInspBtnState = msg;
                        await inspectionService.UpdateWorkPlanDto(sm);
                        foreach (var unit in units)
                        {
                            Console.WriteLine(unit.AssetId);
                            unit.StartInspButtonStatus = true;
                            foreach (var plan in workPlanList)
                            {
                                Console.WriteLine(plan);
                                if (obj.Id != plan.Id)
                                {
                                    plan.inspectionBtnStatus = false;
                                }
                                
                            }
                            await inspectionService.AddActiveInspection(active);
                        }
                    }
                }
            }
        }

        public async System.Threading.Tasks.Task SendInprogressResponseToServer(WorkPlanDto obj)
        {
            if (obj != null)
            {
               
                JObject jPlan = new JObject();
                JObject user = new JObject();
                JArray tasks = new JArray();
                JArray units = new JArray();

                DateTime currentDateTime = DateTime.Now;
                user.Add("name", obj.User.Name);
                user.Add("email", obj.User.Email);


                var allUnits = obj.AllUnits;
                foreach (var unitAsset in allUnits)
                {
                    JObject unit = new JObject();

                    unit.Add("id", unitAsset.AssetId);
                    unit.Add("unitId", unitAsset.UnitId);
                    unit.Add("assetType", unitAsset.AssetType);
                    unit.Add("status", "In Progress");
                   // unit.Add("appForms", formValuesArray);
                    //unit.Add("testForm", unitAsset.TestForm);
                    unit.Add("inspection_type", unitAsset.InspectionType);
                    unit.Add("inspection_freq", unitAsset.InspectionFreq);
                    unit.Add("wPlanId", unitAsset.WPlanId);
                    unit.Add("locationType", unitAsset.LocationType);
                    //unit.Add("coordinates", unitAsset.Coordinates);
                    unit.Add("parent_id", unitAsset.ParentId);

                    units.Add(unit);
                }


                JObject task = new JObject();
                task.Add("taskId", "");
                task.Add("startLocation", "");
                task.Add("endLocation", "");
                task.Add("startTime", "");
                task.Add("endTime", "");
                task.Add("title", obj.Title);
                task.Add("description", "Perform Inspection");
                task.Add("notes", "Default Inspection Notes");
                task.Add("units", units);
                tasks.Add(task);

                jPlan.Add("title", obj.Title);
                jPlan.Add("workplanTemplateId", obj.Id);
                jPlan.Add("lineId", obj.LineId);
                jPlan.Add("status", "In Progress");
                jPlan.Add("user", user);
                jPlan.Add("date", currentDateTime.ToString());
                jPlan.Add("tasks", tasks);

                Console.WriteLine(jPlan);

                var httpclient = new HttpClient();
                string formDataObj = JsonConvert.SerializeObject(jPlan);

                if (formDataObj != null)
                {
                    string url = string.Format(AppConstants.JourneyPlanStart_URL);
                    StringContent content = new StringContent(formDataObj, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await httpclient.PostAsync(new Uri(url), content);
                    if (response.IsSuccessStatusCode)
                    {
                        formDataObj = null;
                        await Shell.Current.GoToAsync("workPlansPage");
                    }
                }
            }
        }
        public async void OnSyncCallback1(string code, string selectedWorkPlan, string unitObj)
        {
            var filterdlist = (service.staticListItemDTOs.Where(p => p.Code == code).Take(100));
            Console.WriteLine(filterdlist.ToString(), "filteredlist");



            //StaticListItemsList.Execute(items => { items.Clear(); items.AddRange(filterdlist); });

            if (filterdlist.Count() == 1)
            {

                var staticlistitem = filterdlist.FirstOrDefault();
                if (staticlistitem.Code != "-1")
                {
                    StaticListItemsList1.Add(filterdlist.FirstOrDefault());
                }
            }
            foreach (var listItems in StaticListItemsList1)
            {
                var item = listItems.OptParam1;
                await Shell.Current.GoToAsync($"{nameof(FormPage)}", true, new Dictionary<string, object> { { "OptParam1", item }, { "SelectedWorkPlan", selectedWorkPlan }, { "UnitObj", unitObj } });

            }



        }
        public  void onSyncCallback()
        {
            workPlanList.Clear();
            var filterdlist = (service.staticListItemDTOs.Where(p => p.ListName == "WorkPlanTemplate").Take(100));
            Console.WriteLine(filterdlist.ToString(), "filteredlist");



            //StaticListItemsList.Execute(items => { items.Clear(); items.AddRange(filterdlist); });

            if (filterdlist.Count() == 1)
            {

                var staticlistitem = filterdlist.FirstOrDefault();
                if (staticlistitem.Code != "-1")
                {
                    StaticListItemsList.Add(filterdlist.FirstOrDefault());
                }
            }
            else
            {
                StaticListItemsList.Execute(items =>

                {
                    //items.Clear(); 
                    items.AddRange(filterdlist);
                });

                foreach (var listItems in StaticListItemsList)
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
                        updateWorkPlanDtoStatus();
                    }
                }
                
                staticListItemsList.Clear();
            }

        }

        public async void updateWorkPlanDtoStatus()
        {
            var sessions = await inspectionService.GetWorkPlanDtos();
            int count = sessions.Count;
            Console.WriteLine(sessions.Count);
            if(count > 0) { 
                foreach(var session in sessions)
                {
                    var id = session.Id;
                    foreach(var wp in workPlanList)
                    {
                        if(wp.Id == session.Id)
                        {
                            wp.msg = session.startInspBtnState;
                        }
                        if(wp.Id == session.Id && wp.msg == "pause")
                        {
                            var allUnits = wp.AllUnits;
                            foreach (var unit in allUnits)
                            {
                                if (unit.Status == "Finished")
                                {
                                    unit.StartInspButtonStatus = false;
                                }
                                else
                                {
                                    unit.StartInspButtonStatus = true;
                                }
                            }
                        }
                        if (session.startInspBtnState == "pause")
                        {
                            if(wp.Id != session.Id)
                            {
                                wp.inspectionBtnStatus = false;
                            }
                        }
                    }
                }
            }
        }

        public void changeAssetInspectionStatus(dynamic unitObj)
        {
            if (workPlanList.Count > 0 && unitObj != null)
            {
                foreach(var planList in workPlanList)
                {
                    var allUnits = planList.AllUnits;
                    foreach(var unit in allUnits)
                    {
                        if(unit.Status == "Finished")
                        {
                            unit.StartInspButtonStatus = false;
                        }
                    }
                }
               
              
            }
        }
    }
}
