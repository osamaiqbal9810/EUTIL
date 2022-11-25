using CommunityToolkit.Mvvm.Input;
using System.Windows.Input;
using TekTrackingCore.Sample.Models;
using TekTrackingCore.Services;

namespace TekTrackingCore;

public partial class UnitControl : ContentView
{
    InspectionService inspectionService;
    public UnitControl()
    {
        InitializeComponent();
        inspectionService = new InspectionService();

    }

}