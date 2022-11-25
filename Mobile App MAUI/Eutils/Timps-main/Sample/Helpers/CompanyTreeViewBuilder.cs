//S5
using TekTrackingCore.Models;
using TekTrackingCore.Sample.Models;
using TekTrackingCore.Sample.Services;

namespace TekTrackingCore.Sample.Helpers
{
    public class CompanyTreeViewBuilder
    {
        private XamlItemGroup FindParentDepartment(XamlItemGroup group, Assets department)
        {
            if (group.GroupId == department.AssetId)
                return group;

            if (group.Children != null)
            {
                foreach (var currentGroup in group.Children)
                {
                    var search = FindParentDepartment(currentGroup, department);

                    if (search != null)
                        return search;
                }
            }

            return null;
        }

        public XamlItemGroup GroupData(DataService service)
        {
            var company = service.GetCompany();
            var wPlan = service.GetAssets();
            var employees = service.GetEmployees();
            var companyGroup = new XamlItemGroup();
            companyGroup.Name = company.CompanyName;

            foreach (var plan in wPlan)
            {
                var itemGroup = new XamlItemGroup();
                itemGroup.Name = plan.WpName;

                // Employees first
                //   var employeesDepartment = employees.Where(x => x.DepartmentId == dept.DepartmentId);

                //foreach (var emp in employeesDepartment)
                //{
                //    var item = new XamlItem();
                //    item.ItemId = emp.EmployeeId;
                //    item.Key = emp.EmployeeName;

                //    itemGroup.XamlItems.Add(item);
                //}

                // Departments now

                companyGroup.Children.Add(itemGroup);
                XamlItemGroup parentGroup = null;

                //foreach (var group in companyGroup.Children)
                //{
                //    parentGroup = FindParentDepartment(group, dept);

                //    if (parentGroup != null)
                //    {
                //        parentGroup.Children.Add(itemGroup);
                //        break;
                //    }
                //}

            }

            return companyGroup;
        }
    }
}