
using TekTrackingCore.ViewModels;

namespace TekTrackingCore.Views;



public partial class Briefing : ContentPage
{
    private BriefingViewModel briefingViewModel;
    public Briefing(BriefingViewModel vm)
    {
        InitializeComponent();
        briefingViewModel = vm;
        this.BindingContext = vm;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        briefingViewModel.SetSesssion();
        briefingViewModel.SetActiveInspection();
        briefingViewModel.SetReportCount();
    }
}