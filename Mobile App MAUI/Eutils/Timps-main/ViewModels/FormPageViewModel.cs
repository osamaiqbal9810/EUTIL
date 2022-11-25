
using CommunityToolkit.Maui.Markup;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Sample.Models;
using TekTrackingCore.Services;



namespace TekTrackingCore.ViewModels
{
    [QueryProperty("OptParam1", "OptParam1")]
    [QueryProperty("SelectedWorkPlan", "SelectedWorkPlan")]
    [QueryProperty("UnitObj", "UnitObj")]

    public partial class FormPageViewModel : BaseViewModel
    {

        [ObservableProperty]

        private string selectedWorkPlan;
        [ObservableProperty]
    
        private string optParam1;

        [ObservableProperty]

        private string unitObj;

        public Action<string> setSelectedWPlanCallBack { get; set; }
        public Action<string> setRenderCallBack { get; set; }
       

      
        partial void OnOptParam1Changed(string value)
        {

            setRenderCallBack(value);
        }
        partial void OnSelectedWorkPlanChanged(string value)
        {
            if(Preferences.ContainsKey("SelectedWorkPlan"))
            {
                Preferences.Remove("SelectedWorkPlan");
            }
            Preferences.Set("SelectedWorkPlan", value);
           
        }

        partial void OnUnitObjChanged(string value)
        {
            if (Preferences.ContainsKey("SelectedUnit"))
            {
                Preferences.Remove("SelectedUnit");
            }
            Preferences.Set("SelectedUnit", value);
         }


    }

}
