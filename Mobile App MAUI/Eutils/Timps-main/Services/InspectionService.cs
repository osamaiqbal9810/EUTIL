

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
        private Dictionary<string, string> formvalue = new Dictionary<string, string>();
        //dynamic formObj;
        //dynamic fieldsList = new List<dynamic>();
        public void mapFields(dynamic verticalStackLayout, dynamic field)
        {


            if (field.field_type == "select")
            {
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
                verticalStackLayout.Children.Add(picker);

            }
            else if (field.field_type == "text")
            {
                MyEntry entry = new MyEntry { Placeholder = field.field_label, TextColor = Color.FromRgb(5, 5, 5), FontSize = 16, PlaceholderColor = Color.FromRgb(5, 5, 5), Keyboard = Keyboard.Numeric };
                entry.fieldname = field.field_name;
                entry.TextChanged += OnEntryTextChanged;
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
                flex.Children.Add(repairedCheck);
                verticalStackLayout.Children.Add(flex);
            }
            else if (field.field_type == "textArea")
            {
                MyEditor editor = new MyEditor { Placeholder = field.field_label, HeightRequest = 250, BackgroundColor = Color.FromRgb(231, 231, 231), FontSize = 14, PlaceholderColor = Color.FromRgb(5, 5, 5) };
                editor.fieldname = field.field_name;
                editor.TextChanged += OnEditorTextChanged;
                verticalStackLayout.Children.Add(editor);
            }


        }

        public async void OnsubmitButtonClicked()
        {
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
                jPlan.Add("status", "Finished");
                jPlan.Add("user", wpObj[0].user);
                jPlan.Add("date", currentDateTime.ToString());
                jPlan.Add("tasks", tasks);

                var httpclient = new HttpClient();
                string formDataObj = JsonConvert.SerializeObject(jPlan);

                if (formDataObj != null)
                {
                    string url = "http://172.19.91.167:4040/api/journeyPlan/";
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
        void OnPickerSelectedIndexChanged(object sender, EventArgs e)
        {
            var picker = (MyPicker)sender;
            string pickerName = picker.fieldname;
            int selectedIndex = picker.SelectedIndex;

            if (selectedIndex != -1)
            {
                string value = (string)picker.ItemsSource[selectedIndex];
                Console.WriteLine(value);

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

    }
}
