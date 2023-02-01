

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
using TekTrackingCore.Views;
using static SQLite.SQLite3;

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

        public static implicit operator ExtendedObservableCollection<T>(WorkPlanDto v)
        {
            throw new NotImplementedException();
        }
    }
    public partial class StaticListItemViewModel : BaseViewModel, INotifyPropertyChanged
    {
        [ObservableProperty]
        public ExtendedObservableCollection<StaticListItemDTO1> staticListItemsList;


        // public bool showSpinner { get; set; }
        [ObservableProperty]
        public bool showNoInspections;

        [ObservableProperty]
        public bool activityIndicatorFlag;

        [ObservableProperty]
        public ExtendedObservableCollection<StaticListItemDTO1> staticListItemsList1;

        [ObservableProperty]
        public bool showSpinner;

        [ObservableProperty]
        public ExtendedObservableCollection<WorkPlanDto> workPlanList;

        public ExtendedObservableCollection<WorkPlanDto> serverPlansList;

        public ExtendedObservableCollection<WorkPlanDto> localWorkPlanList;
        ExpandableView expandableView;
        public Action<string> showAlert { get; set; }

        private DatabaseSyncService service;
        private InspectionService inspectionService;
        private LoginService loginService;
        
        public IDispatcherTimer timer { get; set; }
        public string results;
        public StaticListItemViewModel(InspectionService pService)
        {
            expandableView = new ExpandableView(this);
            service = ServiceResolver.ServiceProvider.GetRequiredService<DatabaseSyncService>();
            loginService = new LoginService();
            staticListItemsList = new ExtendedObservableCollection<StaticListItemDTO1>();

            StaticListItemsList1 = new ExtendedObservableCollection<StaticListItemDTO1>();
            workPlanList = new ExtendedObservableCollection<WorkPlanDto>();
            serverPlansList = new ExtendedObservableCollection<WorkPlanDto>();
            inspectionService = pService;
            staticListItemsList.Clear();
            //workPlanList.Clear();
            inspectionService.ActivityIndicators = loadingStatus;
            // service.SetSyncCallback = onSyncCallback;
            checkWpList();
            
        }
        
        public async void checkWpList()
        {
            // workPlanList.Clear();
            staticListItemsList.Clear();
            var pullList = await service.GetMessageListResponseDTO();
            var filterdlist = (pullList.Where(p => p.ListName == "WorkPlanTemplate").Take(100));
            //if (filterdlist.Count() > 0)
            //{
            onSyncCallback();
            timer = Application.Current.Dispatcher.CreateTimer();
            timer.Interval = TimeSpan.FromSeconds(30);

            timer.Tick += async (s, e) =>
            {
                staticListItemsList.Clear();
                onSyncCallback();
            };
            timer.Start();
            //}
            //else
            //{
            //    loadingStatus(true, false, false);
            //}
             updateWorkPlanDtoStatus();
        }

        public void loadingStatus(bool val1, bool val2, bool val3)
        {
            ShowSpinner = val1;
            ShowNoInspections = val2;
            ActivityIndicatorFlag = val3;
        }
        [RelayCommand]
        public void Test(Sample.Models.Unit unit)
        {
            try
            {
                loadingStatus(false, false, true);

                if (unit != null)
                {
                    string testCode = unit.TestForm[0].TestCode.ToString();
                    var selectedWorkPlan = workPlanList.Where(p => p.Id == unit.WPlanId);

                    var jsonSettings = new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore,
                        MissingMemberHandling = MissingMemberHandling.Ignore
                    };

                    string result = "";
                    if (result != "null")
                    {
                        result = JsonConvert.SerializeObject(selectedWorkPlan, jsonSettings);
                    }
                    string unitObj = "";
                    if (unitObj != "null")
                    {
                        unitObj = JsonConvert.SerializeObject(unit, jsonSettings);
                    }
                    //System.Diagnostics.Debug.WriteLine(result);
                    //Console.WriteLine(filterdlist.ToString(), "filteredlist");
                    if ((unitObj != "null" || unitObj != "") && (result != "null" || result != ""))
                    {
                        OnSyncCallback1(testCode, result, unitObj);
                    }
                    result = "null";
                    unitObj = "null";

                }
                unit = null;
                //               ActivityIndicatorFlag = false;
                // loadingStatus(false, false, false);
            }
            catch (Exception e)
            {
                Console.WriteLine("TestCommand " + e);
            }
        }
        public async System.Threading.Tasks.Task<UserInfo> getLoggedInUser()
        {
            var loggedInUser = await loginService.GetUserInfo();

            if (loggedInUser.Count > 0)
            {
                return loggedInUser[0];
            }
            return null;
        }

        [RelayCommand]
        public async void StartInspection(WorkPlanDto obj)
        {
            await inspectionService.SetUpDb();
            // prepare data for session table
            SessionModel sm = new SessionModel();
            sm.Title = obj.Title;
            sm.Id = obj.Id;
            sm.OfflineInspectionStatus = false;
            var loggedInUser = await getLoggedInUser();
            if (obj != null && loggedInUser != null)
            {
                sm.UserID = loggedInUser.UserId;
                // bool response = await Shell.Current.DisplayAlert("Are you sure ?", "Do you really want to "+ obj.msg + " this Inspection", "OK", "Cancel");
                //showAlert(obj.msg);
                bool response = await expandableView.showAlertDialog(obj.msg);
                string resp = response.ToString();
                if (response == true)
                {
                    var page = Application.Current.MainPage.Navigation.NavigationStack.LastOrDefault();
                    var activeInspections = await inspectionService.GetActiveInspections();
                    if (page != null)
                    {
                        Application.Current.MainPage.Navigation.RemovePage(page);
                    }
                    if (activeInspections.Count > 0)
                    {
                        foreach (var plan in workPlanList)
                        {
                            if (obj.Id != plan.Id)
                            {
                                plan.inspectionBtnStatus = false;
                                if (plan.msg != "start" && plan.msg != "Resume")
                                {
                                    plan.start();

                                }
                                var OtherAssetsAllUnits = plan.AllUnits;
                                foreach (var otherUnit in OtherAssetsAllUnits)
                                {
                                    otherUnit.StartInspButtonStatus = false;
                                    otherUnit.AssetInspectionDone = false;

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
                        unit.AssetInspectionDone = false;

                    }
                    if (obj.msg == "Finished")
                    {
                        foreach (var plan in workPlanList)
                        {
                            if (obj.msg == "Finished")
                            {
                                plan.inspectionBtnStatus = false;
                                plan.AssetInspectionDone = true;
                                plan.OfflineInspection = false;
                                plan.HideBtnOnInspectionComplete = false;

                            }

                        }
                    }
                    else if (obj.msg == "In Progress")
                    {
                        foreach (var plan in workPlanList)
                        {
                            if (obj.msg == "In Progress")
                            {
                                plan.inspectionBtnStatus = false;
                                plan.AssetInspectionDone = false;
                                plan.OfflineInspection = true;
                                plan.HideBtnOnInspectionComplete = false;

                            }

                        }
                    }
                    if (obj.msg == "start")
                    {
                        string nextState = obj.start();
                        sm.startInspBtnState = nextState;
                        sm.PlanInspectionDone = false;
                        sm.PlanStatus = "In Progress";
                        await inspectionService.AddWorkPlanDto(sm);

                        var unitsStart = obj.AllUnits;
                        foreach (var unit in unitsStart)
                        {
                            UnitSessionModel usm = new UnitSessionModel();
                            usm.PR_Key = unit.AssetId.ToString() + "-" + obj.Id.ToString() + "-" + unit.InspectionType.ToString();
                            usm.UnitId = unit.AssetId;
                            usm.InspectionType = unit.InspectionType;
                            usm.WpId = obj.Id;
                            usm.AssetName = unit.UnitId;
                            usm.AssetStatus = "In Progress";
                            usm.AssetInspectionDone = false;
                            usm.AssetInspectionSaved = false;
                            usm.OfflineInspectionDone = false;
                            usm.StartInspButtonStatus = true;

                            await inspectionService.InsertUnitsSession(usm);
                        }

                        // prepare data for ActiveInspection
                        await inspectionService.AddActiveInspection(active);
                        foreach (var plan in workPlanList)
                        {
                            if (obj.Id != plan.Id)
                            {
                                plan.inspectionBtnStatus = false;

                            }

                        }
                        await SendInprogressResponseToServer(obj);
                    }

                    else if (obj.msg == "pause")
                    {
                        UnitSessionModel usm = new UnitSessionModel();
                        workPlanList = inspectionService.getLatestWpList();
                        var unitsPause = obj.AllUnits;
                        string nextState = obj.pause();
                        sm.startInspBtnState = nextState;
                        await inspectionService.UpdateWorkPlanDto(sm);
                        var unitSessionModelList = await inspectionService.GetUnitsSession();
                        foreach (var unit in unitsPause)
                        {
                            var filter = unitSessionModelList.Find(list => list.UnitId == unit.AssetId && list.InspectionType == unit.InspectionType);
                            if (filter != null)
                            {
                                unit.StartInspButtonStatus = false;
                                unit.AssetInspectionDone = filter.AssetInspectionDone;
                                unit.OfflineInspection = filter.OfflineInspectionDone;

                                // upddate unit in local database
                                if (unitSessionModelList.Count > 0)
                                {


                                    filter.StartInspButtonStatus = false;

                                    await inspectionService.UpdateUnitSession(filter);
                                }
                            }

                        }

                        foreach (var plan in workPlanList)
                        {
                            if (plan.AssetInspectionDone == false)
                            {
                                plan.inspectionBtnStatus = true;
                            }
                            else
                            {
                                plan.inspectionBtnStatus = false;
                                plan.HideBtnOnInspectionComplete = false;
                                plan.AssetInspectionDone = true;
                            }

                        }
                        await inspectionService.DeleteActiveInspection(active);
                    }
                    else if (obj.msg == "Resume")
                    {
                        // workPlanList = inspectionService.getLatestWpList();
                        UnitSessionModel usm = new UnitSessionModel();
                        var unitsResume = obj.AllUnits;
                        string msg = obj.start();
                        sm.startInspBtnState = msg;
                        await inspectionService.UpdateWorkPlanDto(sm);
                        var unitSessionModelList = await inspectionService.GetUnitsSession();
                        var reportsToPush = await inspectionService.GetReportsToPush();
                        foreach (var unit in unitsResume)
                        {
                            if (unitSessionModelList.Count > 0)
                            {
                                var filter = unitSessionModelList.Find(list => list.UnitId == unit.AssetId && list.InspectionType == unit.InspectionType);
                                if (filter != null)
                                {
                                    if (filter.AssetStatus == "Completed")
                                    {
                                        filter.OfflineInspectionDone = false;
                                        filter.StartInspButtonStatus = false;
                                        filter.AssetInspectionDone = true;
                                        filter.AssetInspectionSaved = false;
                                    }
                                    else if (filter.AssetStatus == "Completed-Offline")
                                    {
                                        filter.OfflineInspectionDone = true;
                                        filter.StartInspButtonStatus = false;
                                        filter.AssetInspectionDone = false;
                                        filter.AssetInspectionSaved = false;
                                    }
                                    else
                                    {
                                        if (reportsToPush.Count() > 0)
                                        {
                                            var findReport = reportsToPush.Find(rp => rp.UnitId == obj.Id);
                                            if (findReport != null)
                                            {
                                                filter.OfflineInspectionDone = true;
                                                filter.StartInspButtonStatus = false;
                                                filter.AssetInspectionDone = false;
                                            }
                                            else
                                            {
                                                filter.OfflineInspectionDone = false;
                                                filter.StartInspButtonStatus = true;
                                                filter.AssetInspectionDone = false;
                                            }
                                        }
                                        else
                                        {
                                            filter.OfflineInspectionDone = false;
                                            filter.StartInspButtonStatus = true;
                                            filter.AssetInspectionDone = false;
                                        }

                                    }

                                    await inspectionService.UpdateUnitSession(filter);
                                }
                            }
                            if (unit.Status == "Completed")
                            {
                                unit.StartInspButtonStatus = false;
                                unit.AssetInspectionDone = true;
                            }
                            else if (unit.Status == "Completed-Offline")
                            {
                                unit.StartInspButtonStatus = false;
                                unit.AssetInspectionDone = false;
                                unit.OfflineInspection = true;
                            }
                            else
                            {
                                if (reportsToPush.Count() > 0)
                                {
                                    var findReport = reportsToPush.Find(rp => rp.UnitId == obj.Id);
                                    if (findReport != null)
                                    {
                                        unit.OfflineInspection = true;
                                        unit.StartInspButtonStatus = false;
                                        unit.AssetInspectionDone = false;
                                    }
                                    else
                                    {
                                        unit.OfflineInspection = false;
                                        unit.StartInspButtonStatus = true;
                                        unit.AssetInspectionDone = false;
                                    }
                                }
                                else
                                {
                                    unit.OfflineInspection = false;
                                    unit.StartInspButtonStatus = true;
                                    unit.AssetInspectionDone = false;
                                }
                            }
                        }
                        foreach (var plan in workPlanList)
                        {
                            // Console.WriteLine(plan);
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

        public async System.Threading.Tasks.Task SendInprogressResponseToServer(WorkPlanDto obj)
        {
            try
            {
                NetworkAccess accessType = Connectivity.Current.NetworkAccess;
                if (obj != null)
                {
                    Server s = new Server();

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
                    jPlan.Add("date", currentDateTime);
                    jPlan.Add("tasks", tasks);

                    var httpclient = new HttpClient();
                    string formDataObj = JsonConvert.SerializeObject(jPlan);

                    if (formDataObj != null)
                    {
                        foreach (var wPlan in workPlanList)
                        {
                            if (wPlan.Id == obj.Id)
                            {
                                var getUnits = wPlan.AllUnits;
                                foreach (var unit in getUnits)
                                {
                                    unit.Status = "In Progress";
                                    UnitSessionModel usm = new UnitSessionModel();
                                    // inserting data in local db
                                    usm.PR_Key = unit.AssetId.ToString() + "-" + obj.Id.ToString() + "-" + unit.InspectionType.ToString();
                                    usm.UnitId = unit.AssetId;
                                    usm.WpId = obj.Id;
                                    usm.InspectionType = unit.InspectionType;
                                    usm.AssetName = unit.UnitId;
                                    usm.AssetStatus = "In Progress";
                                    usm.AssetInspectionDone = false;
                                    usm.AssetInspectionSaved = false;
                                    usm.StartInspButtonStatus = true;
                                    usm.OfflineInspectionDone = false;
                                    await inspectionService.UpdateUnitSession(usm);

                                }
                            }

                        }

                        InprogressToPush rpt = new InprogressToPush();
                        rpt.Content = formDataObj;
                        //rpt.UnitId = unit.AssetId;
                        rpt.WPId = obj.Id;
                        await inspectionService.AddInprogressToPush(rpt);

                        if (accessType == NetworkAccess.Internet)
                        {
                            inspectionService.pushReportsToServer();
                        }
                        formDataObj = null;
                        await Shell.Current.GoToAsync("workPlansPage");


                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("SendInProgressToServer " + e);
            }
        }
        public async void OnSyncCallback1(string code, string selectedWorkPlan, string unitObj)
        {
            try
            {
                var pullList = await service.GetMessageListResponseDTO();
                var filterdlist = pullList.Find(p => p.ListName == "ApplicationLookups" && p.Code == code);
                // var requiredlist = (filterdlist.Where(p => p.Code == code).Take(100));
                Console.WriteLine(filterdlist.ToString(), "filteredlist");



                //StaticListItemsList.Execute(items => { items.Clear(); items.AddRange(filterdlist); });

                if (filterdlist != null)
                {

                    var staticlistitem = filterdlist;
                    if (staticlistitem.Code != "-1")
                    {
                        StaticListItemsList1.Add(filterdlist);
                    }
                }
                foreach (var listItems in StaticListItemsList1)
                {
                    var item = listItems.OptParam1;
                    var page = Application.Current.MainPage.Navigation.NavigationStack.LastOrDefault();
                    // loadingStatus(false, false, false);
                    await Shell.Current.GoToAsync($"{nameof(FormPage)}", false, new Dictionary<string, object> { { "OptParam1", item }, { "SelectedWorkPlan", selectedWorkPlan }, { "UnitObj", unitObj } });
                    if (page != null)
                    {
                        Application.Current.MainPage.Navigation.RemovePage(page);
                    }

                }

                selectedWorkPlan = null;
                unitObj = null;
            }
            catch (Exception e)
            {
                Console.WriteLine("OnSyncCallBack1 " + e);
            }
        }
        public async void onSyncCallback()
        {
            // loadingStatus(true);
            //workPlanList.Clear();
            try
            {
                var pullList = await service.GetMessageListResponseDTO();
                var filterdlist = (pullList.Where(p => p.ListName == "WorkPlanTemplate").Take(100));
                var loggedInUser = await getLoggedInUser();


                //StaticListItemsList.Execute(items => { items.Clear(); items.AddRange(filterdlist); });
                serverPlansList.Clear();
                staticListItemsList.Clear();
                if (workPlanList.Count > 0 && loggedInUser != null)
                {
                    foreach (var workPlan in workPlanList.ToList())
                    {
                        int index = 0;
                        if (workPlan.User.Id != loggedInUser.UserId)
                        {
                            workPlanList.RemoveAt(index);
                        }
                        index++;
                    }
                }
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

                            if (loggedInUser != null && result.User.Id == loggedInUser.UserId)
                            {
                                if (workPlanList.Count <= 0 && (result.WorkPlanStatusForMobile != "Finished" && result.WorkPlanStatusForMobile != "Missed"))
                                {
                                    workPlanList.Add(result);
                                }
                                else
                                {
                                    var alreadyExist = workPlanList.Where(plan => plan.Id == result.Id).Take(100).FirstOrDefault();
                                    if (alreadyExist != null)
                                    {
                                        for (int x = 0; x < workPlanList.Count; x++)
                                        {
                                            if ((result.WorkPlanStatusForMobile == "Finished" || result.WorkPlanStatusForMobile == "Missed") && (alreadyExist.WorkPlanStatusForMobile != "Finished" || alreadyExist.WorkPlanStatusForMobile != "Missed"))
                                            {
                                                workPlanList.RemoveAt(x);
                                            }
                                        }
                                    }
                                    if (alreadyExist == null && (result.WorkPlanStatusForMobile != "Finished" && result.WorkPlanStatusForMobile != "Missed"))
                                    {
                                        workPlanList.Add(result);
                                    }
                                }
                            }


                        }

                    }

                    // sync if any insepection is deleted on server then remove from list
                    inspectionService.setWorkPlanList(workPlanList);
                    staticListItemsList.Clear();
                }
                updateWorkPlanDtoStatus();
                if (workPlanList.Count > 0)
                {
                    loadingStatus(false, false, false);
                }
                else if (workPlanList.Count <= 0)
                {
                    loadingStatus(false, true, false);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("onsyncCallback() " + ex.ToString());
            }

        }

        public async void updateWorkPlanDtoStatus()
        {
            try
            {
                var sessions = await inspectionService.GetWorkPlanDtos();
                var unitSessions = await inspectionService.GetUnitsSession();
                var loggedInUser = await getLoggedInUser();
                int count = sessions.Count;
                int unitsCount = unitSessions.Count;
                // Console.WriteLine(sessions.Count);
                if (count > 0 && unitsCount > 0)
                {
                    foreach (var wp in workPlanList)
                    {
                        string idToRemove;

                        var session = sessions.Find(sessionList => sessionList.Id == wp.Id && sessionList.UserID == loggedInUser.UserId);
                        wp.msg = session.startInspBtnState;
                        if (session != null)
                        {
                            var allUnits = wp.AllUnits;
                            for (int i = 0; i < allUnits.Count; i++)
                            //foreach (var unit in allUnits)
                            {
                                if (allUnits[i] != null)
                                {
                                    var findUnitSession = unitSessions.Find(unitItem => unitItem.UnitId == allUnits[i].AssetId && unitItem.InspectionType == allUnits[i].InspectionType);
                                    if (findUnitSession != null)
                                    {
                                        allUnits[i].Status = findUnitSession.AssetStatus;
                                        allUnits[i].AssetInspectionDone = findUnitSession.AssetInspectionDone;
                                        allUnits[i].AssetInspectionSaved = findUnitSession.AssetInspectionSaved;
                                        allUnits[i].OfflineInspection = findUnitSession.OfflineInspectionDone;
                                        allUnits[i].StartInspButtonStatus = findUnitSession.StartInspButtonStatus;
                                    }
                                }
                            }
                            if (session.startInspBtnState == "pause")
                            {
                                foreach (var wplan in workPlanList)
                                {
                                    if (wplan.Id != session.Id)
                                    {
                                        wplan.inspectionBtnStatus = false;

                                    }
                                }

                            }

                            if (session.PlanInspectionDone == true)
                            {
                                wp.AssetInspectionDone = true;
                                wp.HideBtnOnInspectionComplete = false;
                                idToRemove = wp.Id.ToString();

                            }
                            else if (session.OfflineInspectionStatus == true)
                            {
                                wp.AssetInspectionDone = false;
                                wp.HideBtnOnInspectionComplete = false;
                                wp.OfflineInspection = true;
                            }

                        }
                        
                    }
                    

                }


            }
            catch (Exception e)
            {
                Console.WriteLine("UpdateWorkPlanDTO-StaticListItemViewModel " + e);
            }

        }
    }
}
