

using CommunityToolkit.Maui.Markup;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using TekTrackingCore.Framework;
using TekTrackingCore.Framework.Types;
using System.Collections.Generic;
using Microsoft.Maui.Controls;
using Newtonsoft.Json;
using Syncfusion.Maui.Data;
using TekTrackingCore.Views;
using TekTrackingCore.Interfaces;
using SQLite;
using TekTrackingCore.Sample.Models;
using TekTrackingCore.ViewModels;
using System.Security.Cryptography.X509Certificates;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;
using Task = System.Threading.Tasks.Task;
using System.ComponentModel;
using TekTrackingCore.Models;

public class MyEntry : Entry
{
    public string fieldname { get; set; }


}

public class MyEditor : Editor
{
    public string fieldname { get; set; }


}


public class MyCheckBox : CheckBox
{
    public string fieldname { get; set; }

}

public class MyPicker : Picker
{
    public string fieldname { get; set; }

}


namespace TekTrackingCore.Services
{
    public class InspectionService
    {
        private SQLiteAsyncConnection _dbConnection;
        private CreateTableResult SessionTableInfo;
        private CreateTableResult UnitSessionTableInfo;
        private CreateTableResult ActiveInspectionTableInfo;
        private CreateTableResult SavedUnitsList;
        private CreateTableResult ReportTableInfo;
        private CreateTableResult ReportsToPushInfo;
        private CreateTableResult InprogressToPushInfo;
        public Dictionary<string, string> formvalue = new Dictionary<string, string>();
        LoginService loginService = new LoginService(); 
        public Action<bool, bool, bool> ActivityIndicators;
        public ExtendedObservableCollection<WorkPlanDto> workPlanList;
        private DatabaseSyncService service;
        // public Action<dynamic> setUnitGreenTick { get; set; }
        private List<string> selectFieldsArray = new List<string>();
        public InspectionService() { }
        public void setWorkPlanList(dynamic list)
        {
            workPlanList = list;
            //updateWpList();

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

        public void updateWpList()
        {
            foreach (var wpList in workPlanList)
            {
                if (wpList.msg == "start" && wpList.inspectionBtnStatus == false)
                {
                    wpList.inspectionBtnStatus = true;
                }
            }
        }
        public dynamic getLatestWpList()
        {
            return workPlanList;
        }
        public async System.Threading.Tasks.Task SetUpDb()
        {
            if (_dbConnection == null)
            {
                string dbPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Eutility.db3");
                _dbConnection = new SQLiteAsyncConnection(dbPath);
                SessionTableInfo = await _dbConnection.CreateTableAsync<SessionModel>();
                UnitSessionTableInfo = await _dbConnection.CreateTableAsync<UnitSessionModel>();
                ActiveInspectionTableInfo = await _dbConnection.CreateTableAsync<ActiveInspections>();
                SavedUnitsList = await _dbConnection.CreateTableAsync<ActiveInspections>();
                ReportTableInfo = await _dbConnection.CreateTableAsync<ReportModel>();
                ReportsToPushInfo = await _dbConnection.CreateTableAsync<ReportsToPush>();
                InprogressToPushInfo = await _dbConnection.CreateTableAsync<InprogressToPush>();
            }

            if (SessionTableInfo != SQLite.CreateTableResult.Created || SessionTableInfo != CreateTableResult.Migrated)
            {
                SessionTableInfo = await _dbConnection.CreateTableAsync<SessionModel>();
            }
            if (ActiveInspectionTableInfo != SQLite.CreateTableResult.Created || ActiveInspectionTableInfo != CreateTableResult.Migrated)
            {
                ActiveInspectionTableInfo = await _dbConnection.CreateTableAsync<ActiveInspections>();
            }
            if (SavedUnitsList != SQLite.CreateTableResult.Created || SavedUnitsList != CreateTableResult.Migrated)
            {
                SavedUnitsList = await _dbConnection.CreateTableAsync<UnitModel>();
            }
            if (UnitSessionTableInfo != SQLite.CreateTableResult.Created || UnitSessionTableInfo != CreateTableResult.Migrated)
            {
                UnitSessionTableInfo = await _dbConnection.CreateTableAsync<UnitSessionModel>();
            }
            if (ReportTableInfo != SQLite.CreateTableResult.Created || ReportTableInfo != CreateTableResult.Migrated)
            {
                ReportTableInfo = await _dbConnection.CreateTableAsync<ReportModel>();
            }
            if (ReportsToPushInfo != SQLite.CreateTableResult.Created || ReportsToPushInfo != CreateTableResult.Migrated)
            {
                ReportsToPushInfo = await _dbConnection.CreateTableAsync<ReportsToPush>();
            }
            if (InprogressToPushInfo != SQLite.CreateTableResult.Created || InprogressToPushInfo != CreateTableResult.Migrated)
            {
                InprogressToPushInfo = await _dbConnection.CreateTableAsync<InprogressToPush>();
            }
        }


        public void mapFields(dynamic verticalStackLayout, dynamic field, dynamic savedFormValues)
        {
            //formvalue = formvaluenew;
            try
            {
                if (field.field_type == "select")
                {
                    selectFieldsArray.Add(field.field_name.ToString());
                    var selectOptions = new List<string>();
                    foreach (var option in field.options)
                    {
                        string optionValue = option.label;
                        selectOptions.Add(optionValue);
                    }
                    verticalStackLayout.Children.Add(new Label
                    {
                        Text = field.field_label,
                        FontSize = 14,
                        Padding = 4,
                        TextColor = Color.FromRgb(5, 5, 5)
                    });
                    MyPicker picker = new MyPicker { Title = field.field_label, TitleColor = Color.FromRgb(250, 250, 250), TextColor = Color.FromRgb(5, 5, 5), FontSize = 14 };
                    picker.fieldname = field.field_name;
                    picker.SelectedIndexChanged += OnPickerSelectedIndexChanged;
                    picker.ItemsSource = selectOptions;


                    if (savedFormValues.Count > 0)
                    {
                        string fieldName = field.field_name;
                        JObject savedForm = new JObject();
                        savedForm = savedFormValues[0].ToObject<JObject>();

                        if (savedForm.ContainsKey(fieldName))
                        {
                            string value = (string)savedForm.GetValue(fieldName);
                            int index = 0;
                            for (int i = 0; i < selectOptions.Count; i++)
                            {
                                if (selectOptions[i] == value)
                                {
                                    index = i;
                                }
                            }

                            picker.SelectedIndex = index;

                        }
                    }

                    verticalStackLayout.Children.Add(picker);

                }
                else if (field.field_type == "text")
                {
                    MyEntry entry = new MyEntry { Placeholder = field.field_label, TextColor = Color.FromRgb(5, 5, 5), FontSize = 16, PlaceholderColor = Color.FromRgb(5, 5, 5), Keyboard = Keyboard.Numeric };
                    entry.fieldname = field.field_name;
                    entry.TextChanged += OnEntryTextChanged;
                    if (savedFormValues.Count > 0)
                    {
                        string fieldName = field.field_name;
                        JObject savedForm = new JObject();
                        savedForm = savedFormValues[0].ToObject<JObject>();

                        if (savedForm.ContainsKey(fieldName))
                        {
                            var value = savedForm.GetValue(fieldName);
                            entry.Text = value.ToString();
                        }
                    }
                    verticalStackLayout.Children.Add(entry);
                }
                else if (field.field_type == "checkbox")
                {
                    HorizontalStackLayout flex = new HorizontalStackLayout();

                    Label myLabel = new Label { Text = field.field_label, FontSize = 14, Padding = 4, TextColor = Color.FromRgb(5, 5, 5) };
                    flex.Children.Add(myLabel);

                    MyCheckBox repairedCheck = new MyCheckBox { IsChecked = false };
                    repairedCheck.fieldname = field.field_name;
                    repairedCheck.CheckedChanged += OnCheckBoxCheckedChanged;

                    if (savedFormValues.Count > 0)
                    {
                        string fieldName = field.field_name;
                        JObject savedForm = new JObject();
                        savedForm = savedFormValues[0].ToObject<JObject>();
                        Console.WriteLine(savedForm);

                        if (savedForm.ContainsKey(fieldName))
                        {
                            var value = savedForm.GetValue(fieldName);
                            repairedCheck.IsChecked = (bool)value;
                        }
                    }

                    flex.Children.Add(repairedCheck);

                    verticalStackLayout.Children.Add(flex);
                }
                else if (field.field_type == "textArea")
                {
                    MyEditor editor = new MyEditor { Placeholder = field.field_label, HeightRequest = 250, BackgroundColor = Color.FromRgb(231, 231, 231), FontSize = 14, PlaceholderColor = Color.FromRgb(5, 5, 5) };
                    editor.fieldname = field.field_name;
                    editor.TextChanged += OnEditorTextChanged;

                    if (savedFormValues.Count > 0)
                    {
                        string fieldName = field.field_name;
                        JObject savedForm = new JObject();
                        savedForm = savedFormValues[0].ToObject<JObject>();

                        if (savedForm.ContainsKey(fieldName))
                        {
                            var value = savedForm.GetValue(fieldName);
                            editor.Text = value.ToString();
                        }
                    }

                    verticalStackLayout.Children.Add(editor);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("MAp Fields " + e);
            }
        }

        public async void OnsubmitButtonClicked(string selectedWp, string selectedUnit)
        {
            bool completeFilledOrNot = false;
            foreach (var key in selectFieldsArray)
            {
                string keyItem = key;
                if (formvalue.ContainsKey(keyItem))
                {
                    completeFilledOrNot = true;
                }
                else
                {
                    completeFilledOrNot = false;
                }
            }
            bool ackResp = await App.Current.MainPage.DisplayAlert("Do you really want to submit the inspection?", "You will not be able to edit this in the future.", "Yes", "No");
            if (ackResp == true)
            {
                // if (completeFilledOrNot == true)
                //{
                try
                {
                    NetworkAccess accessType = Connectivity.Current.NetworkAccess;

                    var wp = Preferences.Get("SelectedWorkPlan", "");
                    var unitOb = Preferences.Get("SelectedUnit", "");
                    if (wp != "" && unitOb != "")
                    {
                        DateTime currentDateTime = DateTime.Now;

                        JObject jPlan = new JObject();
                        JArray tasks = new JArray();
                        JObject jObject = new JObject();
                        JArray units = new JArray();
                        JArray formValuesArray = new JArray();
                        ///units
                        var wpObj = JsonConvert.DeserializeObject<dynamic>(wp);
                        var unitObj = JsonConvert.DeserializeObject<dynamic>(unitOb);


                        foreach (var obj in formvalue)
                        {
                            jObject.Add(obj.Key, obj.Value);
                        }

                        formValuesArray.Add(jObject);
                        JObject unit = new JObject();
                        unit.Add("id", unitObj.assetId);
                        unit.Add("unitId", unitObj.unitId);
                        unit.Add("assetType", unitObj.assetType);
                        unit.Add("status", "Finished");
                        unit.Add("appForms", formValuesArray);
                        unit.Add("testForm", unitObj.testForm);
                        unit.Add("inspection_type", unitObj.inspection_type);
                        unit.Add("inspection_freq", unitObj.inspection_freq);
                        unit.Add("wPlanId", unitObj.wPlanId);
                        unit.Add("locationType", unitObj.locationType);
                        unit.Add("coordinates", unitObj.coordinates);
                        unit.Add("parent_id", unitObj.parent_id);
                        units.Add(unit);
                        // tasks
                        JObject task = new JObject();
                        task.Add("taskId", "");
                        task.Add("startLocation", "");
                        task.Add("endLocation", "");
                        task.Add("startTime", "");
                        task.Add("endTime", "");
                        task.Add("title", wpObj[0].title);
                        task.Add("description", "Perform Inspection");
                        task.Add("notes", "Default Inspection Notes");
                        task.Add("units", units);
                        tasks.Add(task);

                        jPlan.Add("title", wpObj[0].title);
                        jPlan.Add("workplanTemplateId", wpObj[0]._id);
                        jPlan.Add("lineId", wpObj[0].lineId);
                        //jPlan.Add("status", "Finished");
                        jPlan.Add("user", wpObj[0].user);
                        jPlan.Add("date", currentDateTime);
                        jPlan.Add("tasks", tasks);

                        var httpclient = new HttpClient();
                        string formDataObj = JsonConvert.SerializeObject(jPlan);

                        if (formDataObj != null)
                        {

                            Server s = new Server();
                            string url = string.Format(s.JourneyPlanFinish_URL);
                            StringContent content = new StringContent(formDataObj, Encoding.UTF8, "application/json");
                            if (accessType == NetworkAccess.Internet)
                            {
                                //HttpResponseMessage response = await httpclient.PostAsync(new Uri(url), content);
                                //if (response.IsSuccessStatusCode)
                                //{
                                ReportsToPush rpt = new ReportsToPush();
                                rpt.Content = formDataObj;
                                rpt.UnitId = unitObj.assetId;
                                rpt.WPId = wpObj[0]._id;
                                await AddReportToPush(rpt);

                                var toast = Toast.Make("Inspection Submitted Successfully!", ToastDuration.Long);
                                await toast.Show();
                                performPostSubmitOperations(unitObj, formDataObj);
                                pushReportsToServer();
                                // }

                            }
                            else
                            {
                                ReportsToPush rpt = new ReportsToPush();
                                rpt.Content = formDataObj;
                                rpt.UnitId = unitObj.assetId;
                                rpt.WPId = wpObj[0]._id;
                                await AddReportToPush(rpt);

                                var toast = Toast.Make("Inspection Submitted Offline!", ToastDuration.Long);
                                await toast.Show();
                                performPostSubmitOperations(unitObj, formDataObj, "OFFLINE");

                            }
                            

                            var page = Application.Current.MainPage.Navigation.NavigationStack.Last();
                            await Shell.Current.GoToAsync("workPlansPage", false);
                            Application.Current.MainPage.Navigation.RemovePage(page);
                        }

                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                    return; // handle
                }
                //}
                //else
                //{
                //    await App.Current.MainPage.DisplayAlert("Incomplete Form?", "Please fill the required fields carefully", "ok");
                //}
            }
        }
        public async void performPostSubmitOperations(dynamic unitObj, string content, string status = "ONLINE")
        {
            var loggedInUser = await getLoggedInUser();
            foreach (var workP in workPlanList)
            {
                if (workP.msg != "Finished")
                {
                    bool allInspectionsCompletedFlag = true;
                    bool allInspectionsCompletedFlagOffline = true;
                    var allUnits = workP.AllUnits;
                    if (allUnits.Count > 0)
                    {
                        UnitSessionModel usm = new UnitSessionModel();
                        foreach (var pUnit in allUnits)
                        {
                            if (pUnit.AssetId.ToString() == unitObj.assetId.ToString() && workP.Inspection_Type.ToString() == unitObj.inspection_type.ToString())
                            {
                                if (status == "ONLINE")
                                {
                                    pUnit.AssetInspectionDone = true;
                                    pUnit.OfflineInspection = false;
                                    pUnit.Status = "Completed";

                                    usm.PR_Key = pUnit.AssetId.ToString() + "-" + workP.Id.ToString() + "-" + pUnit.InspectionType.ToString();
                                    usm.UnitId = pUnit.AssetId;
                                   // usm.UserID = loggedInUser.UserId;
                                    usm.WpId = workP.Id;
                                    usm.AssetName = pUnit.UnitId;
                                    usm.InspectionType = pUnit.InspectionType;
                                    usm.AssetStatus = "Completed";
                                    usm.AssetInspectionDone = true;
                                    usm.AssetInspectionSaved = false;
                                    usm.StartInspButtonStatus = false;
                                    usm.OfflineInspectionDone = false;
                                }
                                else
                                {
                                    pUnit.AssetInspectionDone = false;
                                    pUnit.OfflineInspection = true;
                                    pUnit.Status = "Completed-Offline";

                                    usm.PR_Key = pUnit.AssetId.ToString() + "-" + workP.Id.ToString() + "-" + pUnit.InspectionType.ToString();
                                    usm.UnitId = pUnit.AssetId;
                                    usm.WpId = workP.Id;
                                    //usm.UserID = loggedInUser.UserId;
                                    usm.AssetName = pUnit.UnitId;
                                    usm.InspectionType = pUnit.InspectionType;
                                    usm.AssetStatus = "Completed-Offline";
                                    usm.AssetInspectionDone = false;
                                    usm.AssetInspectionSaved = false;
                                    usm.StartInspButtonStatus = false;
                                    usm.OfflineInspectionDone = true;
                                }
                                pUnit.StartInspButtonStatus = false;
                                pUnit.AssetInspectionSaved = false;

                                await UpdateUnitSession(usm);
                            }
                            else if(workP.Inspection_Type.ToString() == unitObj.inspection_type.ToString())
                            {
                                var unitSessions = await GetUnitsSession();
                                if (unitSessions.Count() > 0 && loggedInUser != null)
                                {
                                    var findSession = unitSessions.Find(session => session.UnitId == pUnit.Id && session.InspectionType == pUnit.InspectionType);
                                    if (findSession != null)
                                    {
                                        pUnit.StartInspButtonStatus = findSession.StartInspButtonStatus;
                                        pUnit.AssetInspectionDone = findSession.AssetInspectionDone;
                                        pUnit.AssetInspectionSaved = findSession.AssetInspectionSaved;
                                        pUnit.OfflineInspection = findSession.OfflineInspectionDone;
                                    }
                                }

                            }
                            if (status == "ONLINE")
                            {
                                if (pUnit.Status != "Completed")
                                {
                                    allInspectionsCompletedFlag = false;
                                }
                            }
                            else
                            {
                                if (pUnit.Status != "Completed-Offline")
                                {
                                    allInspectionsCompletedFlagOffline = false;
                                }
                            }

                        }
                        if (status == "ONLINE")
                        {
                            if (allInspectionsCompletedFlag == true)
                            {
                                allInspectionsCompletedFlag = false;

                                handleInspectionBtnStatus(workP.Id, workP.InspectionType, content);
                            }
                        }
                        else
                        {
                            if (allInspectionsCompletedFlagOffline == true)
                            {
                                allInspectionsCompletedFlagOffline = false;

                                handleInspectionBtnStatus(workP.Id, workP.InspectionType, content, "OFFLINE");
                            }
                        }
                        // delete unit form from local database if it is stored here after inspection submission
                        var getSavedUnitForms = await GetSavedUnitForms();
                        if (getSavedUnitForms.Count > 0)
                        {
                            foreach (var localForms in getSavedUnitForms)
                            {
                                if (localForms.AssetId.ToString() == unitObj.assetId.ToString())
                                {
                                    await DeleteSavedUnitForms(localForms);
                                }
                            }
                        }

                    }


                }
            }
        }
        public async void handleInspectionBtnStatus(string idToRemove, string inspectionType, string content, string status = "ONLINE")
        {
            service = ServiceResolver.ServiceProvider.GetRequiredService<DatabaseSyncService>();
            int index = 0;
            var loggedInUser = await getLoggedInUser();
            foreach (var wp in workPlanList.ToList())
            {
                if (wp.Id == idToRemove && wp.InspectionType == inspectionType)
                {

                    if (status == "ONLINE")
                    {
                        wp.msg = "Finished";
                        wp.AssetInspectionDone = true;
                        wp.HideBtnOnInspectionComplete = false;
                        wp.OfflineInspection = false;
                    }
                    else
                    {
                        wp.msg = "In Progress";
                        wp.AssetInspectionDone = false;
                        wp.HideBtnOnInspectionComplete = false;
                        wp.OfflineInspection = true;
                    }
                    var getSessions = await GetWorkPlanDtos();
                    if (status == "ONLINE")
                    {
                        if (getSessions.Count() > 0)
                        {
                            var findSession = getSessions.Find(session => session.Id == wp.Id && session.UserID == loggedInUser.UserId);
                            if (findSession != null)
                            {
                                await DeleteWorkPlanDto(findSession);
                            }
                        }
                        // UPDATE "WORKPLANSTATUSFORMOBILE"  status in local db

                        var pullList = await service.GetMessageListResponseDTO();
                        var filterdlist = pullList.FindAll(p => p.ListName == "WorkPlanTemplate");

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
                                if (result.Id == wp.Id)
                                {
                                    result.WorkPlanStatusForMobile = "Finished";
                                    string serialized = JsonConvert.SerializeObject(result);
                                    listItems.OptParam1 = serialized;
                                    await service.UpdateMessageListResponseDTO(listItems);
                                }
                            }
                        }

                        ReportModel rp = new ReportModel();
                        rp.Title = wp.Title;
                        rp.startInspBtnState = "Finished";
                        rp.Id = wp.Id;
                        rp.PlanInspectionDone = true;
                        rp.PlanStatus = "Completed";
                        //await UpdateWorkPlanDto(sm);
                        await AddReports(rp);

                        // remove finished inspection from workplanList

                        workPlanList.RemoveAt(index);
                        foreach (var workplan in workPlanList)
                        {
                            if (workplan.Id != wp.Id)
                            {
                                workplan.inspectionBtnStatus = true;
                            }
                        }

                    }
                    else
                    {
                        if (getSessions.Count() > 0)
                        {
                            var findSession = getSessions.Find(session => session.Id == wp.Id && session.UserID == loggedInUser.UserId);
                            if (findSession != null)
                            {
                                findSession.OfflineInspectionStatus = true;
                                findSession.startInspBtnState = "Completed-Offline";
                                await UpdateWorkPlanDto(findSession);
                            }
                        }
                        foreach (var workplan in workPlanList)
                        {
                            if (workplan.Id != wp.Id)
                            {
                                workplan.inspectionBtnStatus = true;
                            }
                        }
                    }

                }
                else if (wp.Id != idToRemove)
                {
                    wp.inspectionBtnStatus = true;
                }

                index++;
            }
        }

        public async System.Threading.Tasks.Task OnsaveButtonClicked()
        {
            try
            {
                bool ackResp = await App.Current.MainPage.DisplayAlert("Do you really want to save the inspection?", "", "Yes", "No");
                if (ackResp)
                {
                    var unitForm = new List<dynamic>();
                    JObject values = new JObject();

                    var wp = Preferences.Get("SelectedWorkPlan", "");
                    var wpObj = JsonConvert.DeserializeObject<dynamic>(wp);
                    var loggedInUser = await getLoggedInUser();
                    var unitOb = Preferences.Get("SelectedUnit", "");
                    var unitObj = JsonConvert.DeserializeObject<dynamic>(unitOb);
                    foreach (var obj in formvalue)
                    {
                        values.Add(obj.Key, obj.Value);
                    }
                    unitForm.Add(values);
                    string unitFormObj = JsonConvert.SerializeObject(unitForm);

                    UnitModel unitModel = new UnitModel();
                    unitModel.AssetId = unitObj.assetId;
                    unitModel.AssetName = unitObj.unitId;
                    unitModel.Values = unitFormObj;
                    unitModel.InspType = unitObj.inspection_type;
                    // saving form in local database
                    await InsertUnitForm(unitModel);
                    ;
                    var toast = Toast.Make("Inspection saved Successfully!", ToastDuration.Long);
                    await toast.Show();

                    foreach (var workP in workPlanList)
                    {
                        if (workP.Id.ToString() == wpObj[0]._id.ToString())
                        {
                            bool allInspectionsCompletedFlag = true;
                            var allUnits = workP.AllUnits;
                            if (allUnits.Count > 0)
                            {
                                foreach (var pUnit in allUnits)
                                {
                                    if (pUnit.AssetId.ToString() == unitObj.assetId.ToString() && workP.Inspection_Type.ToString() == unitObj.inspection_type.ToString())
                                    {
                                        pUnit.StartInspButtonStatus = true;
                                        pUnit.AssetInspectionSaved = true;
                                        pUnit.AssetInspectionDone = false;
                                        pUnit.Status = "In Progress";
                                        pUnit.OfflineInspection = false;

                                        UnitSessionModel usm = new UnitSessionModel();
                                        usm.PR_Key = pUnit.AssetId.ToString() + "-" + workP.Id.ToString() + "-" + pUnit.InspectionType.ToString();
                                        usm.UnitId = pUnit.AssetId;
                                        //usm.UserID = loggedInUser.UserId;
                                        usm.WpId = workP.Id;
                                        usm.InspectionType = pUnit.InspectionType;
                                        usm.AssetName = pUnit.UnitId;
                                        usm.AssetStatus = "In Progress";
                                        usm.AssetInspectionDone = false;
                                        usm.AssetInspectionSaved = true;
                                        usm.StartInspButtonStatus = true;
                                        usm.OfflineInspectionDone = false;
                                        await UpdateUnitSession(usm);

                                    }


                                    if (pUnit.Status != "Completed")
                                    {
                                        allInspectionsCompletedFlag = false;
                                    }
                                }
                                if (allInspectionsCompletedFlag == true)
                                {
                                    workP.AssetInspectionDone = true;
                                    workP.HideBtnOnInspectionComplete = false;
                                    workP.OfflineInspection = false;
                                }

                            }


                        }
                    }
                    var page = Application.Current.MainPage.Navigation.NavigationStack.Last();

                    await Shell.Current.GoToAsync("workPlansPage", false);
                    ActivityIndicators(false, false, false);
                    Application.Current.MainPage.Navigation.RemovePage(page);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("SavedButtonClicked_InspectionService " + e.ToString());
            }

        }


        public async void pushReportsToServer()
        {

            /* 
            whenever change in internet connectivity state occurs, this function will check the ReportToPush table,
            which is basically a cache storage for submitted inspections wheninternet is off, this function will push all
            inspections to backend server and remove the session table entry and add it to report model
             */


            Server s = new Server();

            string url1 = string.Format(s.JourneyPlanStart_URL);

            var inProgressToPush = await GetInprogressToPush();
            foreach (var inpogressReport in inProgressToPush)
            {
                var httpclient = new HttpClient();
                StringContent content = new StringContent(inpogressReport.Content, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await httpclient.PostAsync(new Uri(url1), content);
                if (response.IsSuccessStatusCode)
                {
                    int deleted = await DeleteInProgressToPush(inpogressReport);

                }

            }


            SessionModel sm = new SessionModel();
            ReportModel rp = new ReportModel();
            string url = string.Format(s.JourneyPlanFinish_URL);
            var unitsSession = await GetUnitsSession();

            var reportsToPush = await GetReportsToPush();

            var sessionsList = await GetWorkPlanDtos();

            foreach (var report in reportsToPush)
            {
                var httpclient = new HttpClient();
                var allUnitsCompletedFlag = true;
                StringContent content = new StringContent(report.Content, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await httpclient.PostAsync(new Uri(url), content);
                if (response.IsSuccessStatusCode)
                {
                    var findUnitSession = unitsSession.FindAll(unitSession => unitSession.WpId == report.WPId);

                    foreach (var session in findUnitSession)
                    {
                        if (session.AssetStatus != "Completed-Offline")
                        {
                            allUnitsCompletedFlag = false;
                        }
                        if (session.UnitId == report.UnitId)
                        {
                            // if a single unit is submitted in offline mode, and then network is restored
                            // in this scenerio single unit will be marked as submitted online
                            session.AssetInspectionDone = true;
                            session.OfflineInspectionDone = false;
                            session.AssetStatus = "Completed";
                            await UpdateUnitSession(session);
                        }
                    }
                    if (allUnitsCompletedFlag == true)
                    {
                        var findSession = sessionsList.Find(session => session.Id == report.WPId);
                        if (findSession != null)
                        {
                            rp.Title = findSession.Title;
                            rp.startInspBtnState = "Finished";
                            rp.Id = findSession.Id;
                            rp.PlanInspectionDone = true;
                            rp.PlanStatus = "Completed";
                            await AddReports(rp);
                            await DeleteWorkPlanDto(findSession);
                        }

                    }
                    int deleted = await DeleteReportToPush(report);
                }
            }

        }
        void OnPickerSelectedIndexChanged(object sender, EventArgs e)
        {
            var picker = (MyPicker)sender;
            string pickerName = picker.fieldname;
            int selectedIndex = picker.SelectedIndex;

            if (selectedIndex != -1)
            {
                string value = (string)picker.ItemsSource[selectedIndex];


                if (formvalue.ContainsKey(pickerName))
                {
                    formvalue[pickerName] = value;

                }
                else

                {
                    formvalue.Add(pickerName, value);
                }
            }
        }

        void OnEntryTextChanged(object sender, TextChangedEventArgs e)
        {
            var entry = (MyEntry)sender;
            string fname = entry.fieldname;
            string value = entry.Text;

            if (formvalue.ContainsKey(fname))
            {
                formvalue[fname] = value;

            }
            else

            {
                formvalue.Add(fname, value);
            }
        }

        void OnCheckBoxCheckedChanged(object sender, CheckedChangedEventArgs e)
        {
            var checkBox = (MyCheckBox)sender;
            string checkName = checkBox.fieldname;
            bool value = e.Value;

            if (formvalue.ContainsKey(checkName))
            {
                formvalue[checkName] = value.ToString();

            }
            else

            {
                formvalue.Add(checkName, value.ToString());
            }
        }

        void OnEditorTextChanged(object sender, TextChangedEventArgs e)
        {
            var editor = (MyEditor)sender;
            string value = editor.Text;
            string editorName = editor.fieldname;

            if (formvalue.ContainsKey(editorName))
            {
                formvalue[editorName] = value;

            }
            else

            {
                formvalue.Add(editorName, value);
            }
        }

   
        public async Task<List<SessionModel>> GetWorkPlanDtos()
        {
            await SetUpDb();
            var workPlanList = await _dbConnection.Table<SessionModel>().ToListAsync();
            return workPlanList;
        }

        public async Task<int> AddWorkPlanDto(SessionModel workPlanDto)
        {
            await SetUpDb();
            var loggedInUser = await getLoggedInUser();
            var existingWorkPlans = await GetWorkPlanDtos();
            var alreadyExist = existingWorkPlans.Where(plan => plan.Id == workPlanDto.Id && plan.UserID == loggedInUser.UserId );
            var item = alreadyExist.FirstOrDefault();
            if (item == null)
            {
                return await _dbConnection.InsertAsync(workPlanDto);
            }
            else
            {
                return await _dbConnection.UpdateAsync(workPlanDto);
                // return 0;
            }
        }

        public Task<int> DeleteWorkPlanDto(SessionModel workPlanDto)
        {
            return _dbConnection.DeleteAsync(workPlanDto);
        }

        public Task<int> UpdateWorkPlanDto(SessionModel workPlanDto)
        {
            return _dbConnection.UpdateAsync(workPlanDto);
        }

        public async Task<int> DeleteAllWorkPlanDto()
        {
            await SetUpDb();
            return await _dbConnection.DeleteAllAsync<SessionModel>();
        }
        // Report Model

        public async Task<List<ReportModel>> GetReports()
        {
            await SetUpDb();
            var reportList = await _dbConnection.Table<ReportModel>().ToListAsync();
            return reportList;
        }

        public async Task<int> AddReports(ReportModel rp)
        {
            await SetUpDb();
            var existingReports = await GetReports();
            var alreadyExist = existingReports.Find(plan => plan.Id == rp.Id);
            var item = alreadyExist;

            if (item == null)
            {
                return await _dbConnection.InsertAsync(rp);
            }
            else
            {
                return await _dbConnection.UpdateAsync(rp);
                // return 0;
            }

        }

        public Task<int> DeleteReport(ReportModel rp)
        {
            return _dbConnection.DeleteAsync(rp);
        }

        public Task<int> UpdateReport(ReportModel rp)
        {
            return _dbConnection.UpdateAsync(rp);
        }

        public async Task<int> DeleteAllReports()
        {
            await SetUpDb();
            return await _dbConnection.DeleteAllAsync<ReportModel>();
        }

        // active inspections 

        public async Task<List<ActiveInspections>> GetActiveInspections()
        {
            await SetUpDb();
            var workPlanList = await _dbConnection.Table<ActiveInspections>().ToListAsync();
            return workPlanList;
        }

        public Task<int> DeleteActiveInspection(ActiveInspections activeInspections)
        {
            return _dbConnection.DeleteAsync(activeInspections);
        }
        public async Task<int> AddActiveInspection(ActiveInspections activeInspections)
        {
            await SetUpDb();
            var existing = await GetActiveInspections();
            var item = existing.FirstOrDefault();
            if (item != null)
            {
                await DeleteActiveInspection(item);
            }
            return await _dbConnection.InsertAsync(activeInspections);

        }
        public async Task<int> DeleteAllActiveInspections()
        {
            await SetUpDb();
            return await _dbConnection.DeleteAllAsync<ActiveInspections>();
        }

        //unit model

        public async Task<List<UnitModel>> GetSavedUnitForms()
        {
            // await SetUpDb();
            var units = await _dbConnection.Table<UnitModel>().ToListAsync();
            return units;
        }

        public async Task<int> DeleteSavedUnitForms(UnitModel unitModel)
        {
            await SetUpDb();
            return await _dbConnection.DeleteAsync(unitModel);
        }
        public async Task<int> InsertUnitForm(UnitModel unitModel)
        {
            await SetUpDb();
            var unitForms = await GetSavedUnitForms();
            var alreadyExist = unitForms.Find(form => form.AssetId == unitModel.AssetId && form.InspType == unitModel.InspType);
           
            if (alreadyExist == null)
            {
                return await _dbConnection.InsertAsync(unitModel);
            }
            else
            {
                await DeleteSavedUnitForms(alreadyExist);
                return await _dbConnection.InsertAsync(unitModel);
            }
        }

        public async Task<int> DeleteAllUnitForm()
        {
            await SetUpDb();
            return await _dbConnection.DeleteAllAsync<UnitModel>();
        }

        // unitsession model
        public async Task<List<UnitSessionModel>> GetUnitsSession()
        {
            await SetUpDb();
            var units = await _dbConnection.Table<UnitSessionModel>().ToListAsync();
            return units;
        }

        public async Task<int> DeleteSavedUnitsSession(UnitSessionModel unitModel)
        {
            await SetUpDb();
            return await _dbConnection.DeleteAsync(unitModel);
        }
        public async Task<int> InsertUnitsSession(UnitSessionModel unitModel)
        {
            await SetUpDb();
            var loggedInUser = await getLoggedInUser();
            var existingUnitsSession = await GetUnitsSession();
            var alreadyExist = existingUnitsSession.Find(uSession => uSession.UnitId == unitModel.UnitId && uSession.InspectionType == unitModel.InspectionType);
        
            if (alreadyExist == null)
            {
                return await _dbConnection.InsertAsync(unitModel);
            }
            else
            {
                await _dbConnection.DeleteAsync(alreadyExist);
                return await _dbConnection.InsertAsync(unitModel);
            }

        }

        public async Task<int> UpdateUnitSession(UnitSessionModel usm)
        {
            await SetUpDb();
            return await  _dbConnection.UpdateAsync(usm);
        }

        public async Task<int> DeleteAllUnitSession()
        {
            await SetUpDb();
            return await _dbConnection.DeleteAllAsync<UnitSessionModel>();
        }

        // Reports to push 

        public async Task<List<ReportsToPush>> GetReportsToPush()
        {
            await SetUpDb();
            var reportList = await _dbConnection.Table<ReportsToPush>().ToListAsync();
            return reportList;
        }

        public async Task<int> AddReportToPush(ReportsToPush rp)
        {
            await SetUpDb();
            var existingReports = await GetReportsToPush();
            var alreadyExist = existingReports.Find(reports => reports.Content == rp.Content);
            var item = alreadyExist;
            if (item == null)
            {
                return await _dbConnection.InsertAsync(rp);
            }
            else
            {
                return await _dbConnection.UpdateAsync(rp);
            }
        }

        public Task<int> UpdateReportToPush(ReportsToPush rp)
        {
            return _dbConnection.UpdateAsync(rp);
        }

        public async Task<int> DeleteReportToPush(ReportsToPush rp)
        {
            await SetUpDb();
            return await _dbConnection.DeleteAsync(rp);
        }
        public async Task<int> DeleteAllReportToPush()
        {
            await SetUpDb();
            return await _dbConnection.DeleteAllAsync<ReportsToPush>();
        }

        // Inprogress to push
        public async Task<List<InprogressToPush>> GetInprogressToPush()
        {
            await SetUpDb();
            var reportList = await _dbConnection.Table<InprogressToPush>().ToListAsync();
            return reportList;
        }

        public async Task<int> AddInprogressToPush(InprogressToPush rp)
        {
            await SetUpDb();
            var existingReports = await GetInprogressToPush();
            var alreadyExist = existingReports.Find(reports => reports.Content == rp.Content);
            var item = alreadyExist;
            if (item == null)
            {
                return await _dbConnection.InsertAsync(rp);
            }
            else
            {
                return await _dbConnection.UpdateAsync(rp);
            }
        }

        public async Task<int> DeleteInProgressToPush(InprogressToPush rp)
        {
            await SetUpDb();
            return await _dbConnection.DeleteAsync(rp);
        }

        public async Task<int> DeleteAllInProgressToPush()
        {
            await SetUpDb();
            return await _dbConnection.DeleteAllAsync<InprogressToPush>();
        }

    }
}
