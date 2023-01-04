using TekTrackingCore.ViewModels;

namespace TekTrackingCore.Views;

public partial class StaticListItemPage : ContentPage
{
    public StaticListItemPage(StaticListItemViewModel viewModel)
    {
        InitializeComponent();
        this.BindingContext = viewModel;

    }
}