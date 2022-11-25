

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
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Framework;
using TekTrackingCore.Framework.Types;
using TekTrackingCore.Repositry;
using TekTrackingCore.Sample.Models;
using TekTrackingCore.Services;

using Unit = TekTrackingCore.Sample.Models.Unit;

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
    public partial class StaticListItemViewModel : BaseViewModel
    {



        [ObservableProperty]
        public ExtendedObservableCollection<StaticListItemDTO1> staticListItemsList;


        [ObservableProperty]
        public ExtendedObservableCollection<StaticListItemDTO1> staticListItemsList1;

        [ObservableProperty]
        public ExtendedObservableCollection<WorkPlanDto> workPlanList;


        private DatabaseSyncService service;
        public StaticListItemViewModel()
        {


            service = ServiceResolver.ServiceProvider.GetRequiredService<DatabaseSyncService>();
            StaticListItemsList = new ExtendedObservableCollection<StaticListItemDTO1>();
            StaticListItemsList1 = new ExtendedObservableCollection<StaticListItemDTO1>();
            workPlanList = new ExtendedObservableCollection<WorkPlanDto>();

            //staticListItemsList.Add(new StaticListItemDTO1 { Code = "666", Description = "555", ListName = "444", OptParam1 = "3333", OptParam2 = "33", TenantId = "123" });


            service.SetSyncCallback = onSyncCallback;



        }
        [RelayCommand]
        public async void Test(Unit unit)
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
        public void onSyncCallback()
        {
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
                    var item = listItems.OptParam1;

                    var jsonSettings = new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore,
                        MissingMemberHandling = MissingMemberHandling.Ignore
                    };

                    WorkPlanDto result = JsonConvert.DeserializeObject<WorkPlanDto>(item, jsonSettings); // jsonSettings are explicitly supplied

                    workPlanList.Add(result);

                    //var item = listItems.OptParam1;
                    //var jParse = JObject.Parse(item); 
                    // var tasks = jParse["tasks"] ;
                    //foreach (var task in tasks)
                    //{
                    //    foreach(var unit in task["units"])
                    //    {

                    //        Console.WriteLine(unit.ToString(), "unit");
                    //    }
                    //}
                }

                staticListItemsList.Clear();


            }

        }


    }
}
