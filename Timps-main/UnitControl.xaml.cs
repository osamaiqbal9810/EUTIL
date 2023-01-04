using CommunityToolkit.Mvvm.Input;
using System.Windows.Input;
using TekTrackingCore.Sample.Models;
using TekTrackingCore.Services;
using TekTrackingCore.ViewModels;

namespace TekTrackingCore;

public partial class UnitControl : ContentView
{
   public UnitControl()
    {
         InitializeComponent();
    }
  
    public void setStartBtnVisibility(bool status)
    {
        var visibilityStatus = FindByName("startInspectionBtn") as Button;
        if (visibilityStatus != null)
        {
            visibilityStatus.IsVisible= status;
        }
    }
}