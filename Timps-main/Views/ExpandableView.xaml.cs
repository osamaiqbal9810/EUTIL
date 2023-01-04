using System;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Maui.Controls;
using TekTrackingCore.ViewModels;

namespace TekTrackingCore.Views;

public partial class ExpandableView : ContentPage
{
    public ExpandableView(StaticListItemViewModel viewModel)
    {
        InitializeComponent();
        this.BindingContext = viewModel;
    }

}
