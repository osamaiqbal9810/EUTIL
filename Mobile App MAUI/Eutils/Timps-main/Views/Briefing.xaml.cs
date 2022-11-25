
using TekTrackingCore.ViewModels;

namespace TekTrackingCore.Views;



public partial class Briefing : ContentPage
{
    public Briefing(BriefingViewModel vm)
    {
        InitializeComponent();
        this.BindingContext = vm;
    }
}