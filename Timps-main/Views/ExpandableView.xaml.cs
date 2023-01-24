using System;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Maui.Controls;
using TekTrackingCore.Sample.Models;
using TekTrackingCore.Services;
using TekTrackingCore.ViewModels;

namespace TekTrackingCore.Views;

public partial class ExpandableView : ContentPage
{
    public InspectionService inspectionService;
    public ExpandableView(StaticListItemViewModel viewModel)
    {
        InitializeComponent();
        this.BindingContext = viewModel;
        inspectionService = new InspectionService();
       // viewModel.showAlert = showAlertDialog;
    }
    public async System.Threading.Tasks.Task<bool> showAlertDialog(string msg)
    {
        bool response =  await App.Current.MainPage.DisplayAlert("Are you sure ?", "Do you really want to " + msg + "  this Inspection", "OK", "Cancel");
        return response;

    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        var page = Application.Current.MainPage.Navigation.NavigationStack.LastOrDefault();
        if (page != null)
        {
            Application.Current.MainPage.Navigation.RemovePage(page);
        }
    }

}
