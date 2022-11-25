
using TekTrackingCore.ViewModels;
using TekTrackingCore.Views;

namespace TekTrackingCore;

public partial class AppShell : Shell
{
    public AppShell()
         
       
    {
        InitializeComponent();
        BindingContext = new AppShellViewModel();


        Routing.RegisterRoute(nameof(Briefing), typeof(Briefing));
        Routing.RegisterRoute(nameof(LoginPage), typeof(LoginPage));
        //Routing.RegisterRoute("Briefing", typeof(Briefing));

        //Routing.RegisterRoute("LogIn", typeof(LoginPage));

        Routing.RegisterRoute("ProceedPage", typeof(ProceedPage));

        Routing.RegisterRoute(nameof(Hos), typeof(Hos));
        Routing.RegisterRoute(nameof(StaticListItemPage), typeof(StaticListItemPage));
        Routing.RegisterRoute(nameof(ExpandableView), typeof(ExpandableView));
        Routing.RegisterRoute(nameof(FormPage), typeof(FormPage));
        Routing.RegisterRoute("workPlansPage", typeof(ExpandableView));

       

    }
}
