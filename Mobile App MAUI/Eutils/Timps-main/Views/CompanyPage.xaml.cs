//S6 and S7
using TekTrackingCore.Sample.Services;
using TekTrackingCore.Sample.Helpers;
using TekTrackingCore.Models;


namespace TekTrackingCore.Views;


public partial class CompanyPage : ContentPage
{
    private DataService service;
    private CompanyTreeViewBuilder CompanyTreeViewBuilder;

    public CompanyPage(DataService service, CompanyTreeViewBuilder companyTreeViewBuilder)
    {
        InitializeComponent();


        this.service = service;
        this.CompanyTreeViewBuilder = companyTreeViewBuilder;

        ProcessTreeView();
    }

    private void ProcessTreeView()
    {
        var xamlItemGroups = CompanyTreeViewBuilder.GroupData(service);
        var rootNodes = TheTreeView.ProcessXamlItemGroups(xamlItemGroups);
        TheTreeView.RootNodes = rootNodes;
    }
}


