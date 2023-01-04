//S4
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using TekTrackingCore.Framework;
using TekTrackingCore.Framework.Types;
using TekTrackingCore.Model;
using TekTrackingCore.Models;
using TekTrackingCore.Sample.Models;
using TekTrackingCore.Services;
using TekTrackingCore.ViewModels;


namespace TekTrackingCore.Sample.Services
{
    public class DataService
    {
        public ExtendedObservableCollection<Assets> assetslist;
        private DatabaseSyncService service;


        public DataService()
        {
            service = ServiceResolver.ServiceProvider.GetRequiredService<DatabaseSyncService>();

            service.SetSyncCallback = onSyncCallback;
            // assetslist = (ExtendedObservableCollection<Assets>)GetAssets();
            //assetslist = new  ExtendedObservableCollection<Assets>()

            //{

            //    new Assets() { DepartmentId = 3, AssetId = 1, AssetName = "Production", AssetStatus = "Upcoming" },
            //    new Assets() { DepartmentId=3,AssetId = 2, AssetName = "Development", AssetStatus="Upcoming" }
            //};



        }



        public void onSyncCallback()
        {
            var filterdlist = (service.staticListItemDTOs.Where(p => p.ListName == "WorkPlanTemplate").Take(10));
            Console.WriteLine(filterdlist.ToString(), "filteredlist");



            //StaticListItemsList.Execute(items => { items.Clear(); items.AddRange(filterdlist); });

            if (filterdlist.Count() == 1)
            {
                var staticlistitem = filterdlist.FirstOrDefault();
                if (staticlistitem.Code != "-1")
                {
                    //assetslist.Add(filterdlist.FirstOrDefault());
                }
            }
            else
            {
                //assetslist.Execute(items =>
                //{
                //    //items.Clear(); 
                //    items.AddRange(filterdlist);
                //});

                foreach (var filter in filterdlist)
                {
                    Console.WriteLine(filter.ToString(), "filter list");
                    //assetslist.AddRan(filter.OptParam1)


                }



            }


        }
        public Company GetCompany()
        {
            return new Company()
            {
                CompanyId = 1,
                CompanyName = "TC Solutions"
            };
        }

        public IEnumerable<WorkPlan> GetAssets()
        {
            var filterdlist = (service.staticListItemDTOs.Where(p => p.ListName == "WorkPlanTemplate").Take(10));
            Console.WriteLine(filterdlist.ToString(), "filteredlist");
            List<WorkPlan> list = new List<WorkPlan>();

            foreach (var filter in filterdlist)
            {

                Console.WriteLine(filter.Code);
                //assetslist.AddRan(filter.OptParam1)
                if (filter.Code != "-1")
                {
                    var staticlistitem = filterdlist.FirstOrDefault();

                    string extract = filter.OptParam1;
                    WorkPlanDto myDeserializedClass = JsonConvert.DeserializeObject<WorkPlanDto>(extract);


                    //Console.WriteLine(extract.title);
                    list.Add(new WorkPlan { WpName = myDeserializedClass.Title });
                }

            }



            return list;

        }

        public IEnumerable<Employee> GetEmployees()
        {
            return new List<Employee>()
            {
                new Employee() { EmployeeId = 4, EmployeeName = "Inés", DepartmentId = 3 },
                new Employee() { EmployeeId = 5, EmployeeName = "Sara", DepartmentId = 3 }

            };
        }
    }
}
