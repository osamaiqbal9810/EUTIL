using CommunityToolkit.Maui.Markup;
using CommunityToolkit.Maui.Views;
using Microsoft.Maui.Controls;
using TekTrackingCore.ViewModels;

namespace TekTrackingCore.Views;

public partial class Setting : ContentPage
{
    private SettingViewModelcs _viewModel;
	public Setting(SettingViewModelcs vm)
	{
		InitializeComponent();
        _viewModel = vm;
     BindingContext = vm;
     

    }

    public void PoppOpen(object sender, EventArgs e)
    {
        this.ShowPopup(new PopUpPage());
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        _viewModel.ReadSettingsDetailsCommand.Execute(null);
    }







}