using CommunityToolkit.Maui.Views;
using TekTrackingCore.Sample.Models;
using TekTrackingCore.Services;
using TekTrackingCore.ViewModels;

namespace TekTrackingCore.Views;

public partial class ListViewPopUp : Popup
{
    StaticListItemViewModel staticListItemViewModel;
    InspectionService inspectionService;
    public WorkPlanDto selectedWp;
	public ListViewPopUp(WorkPlanDto wpObj, string msg)
	{
		InitializeComponent();
        selectedWp = wpObj;
        inspectionService = new InspectionService();
        staticListItemViewModel = new StaticListItemViewModel(inspectionService);
   
		msgText.Text = msg;
	}

    private void NoButton_Clicked(object sender, EventArgs e)
    {
        Close();
    }

    private void YesButton_Clicked(object sender, EventArgs e)
    {
       
    }
}