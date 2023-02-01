using CommunityToolkit.Maui.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Sample.Models;
using TekTrackingCore.Views;

namespace TekTrackingCore.Services
{
    public class StaticListItemService
    {
        private InspectionService inspectionService;
       
        public StaticListItemService() {
            inspectionService = new InspectionService();
        }
        public async void StartInspectionOperation(WorkPlanDto obj)
        {
            
        }
        public async void openPopUpDialog(WorkPlanDto wpObj, string msg)
        {
            
            await App.Current.MainPage.ShowPopupAsync(new ListViewPopUp(wpObj,msg));
            
        }


    }

}

