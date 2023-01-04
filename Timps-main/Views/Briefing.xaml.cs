
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
        await briefingViewModel.SetSesssion();
        await briefingViewModel.SetActiveInspection();
    }
}