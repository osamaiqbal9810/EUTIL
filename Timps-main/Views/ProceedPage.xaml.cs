using TekTrackingCore.ViewModels;

namespace TekTrackingCore.Views;

public partial class ProceedPage : ContentPage
{
	public ProceedPage(LoginViewModel vm)
	{
		InitializeComponent();
		BindingContext = vm;
	}
}