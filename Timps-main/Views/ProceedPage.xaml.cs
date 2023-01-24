using TekTrackingCore.ViewModels;


namespace TekTrackingCore.Views;

public partial class ProceedPage : ContentPage
{

    public ProceedPage(LoginViewModel vm)
    {


        InitializeComponent();
        NavigationPage.SetHasBackButton(this, false);
        NavigationPage.SetHasNavigationBar(this, false);



        BindingContext = vm;


    }

    protected override void OnDisappearing()
    {
        Unfocus();
        base.OnDisappearing();

    }

}