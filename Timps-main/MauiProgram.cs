using TekTrackingCore.Framework;
using TekTrackingCore.ViewModels;
using TekTrackingCore.Views;
using TekTrackingCore.Services;
using TekTrackingCore.Sample.Services;
using TekTrackingCore.Sample.Helpers;
using Syncfusion.Maui.ListView.Hosting;
using Syncfusion.Maui.Core.Hosting;
using CommunityToolkit.Maui.Markup;
using CommunityToolkit.Maui;

namespace TekTrackingCore;

public static class MauiProgram
{
    public static void UseResolver(this IServiceProvider sp)
    {
        ServiceResolver.RegisterServiceProvider(sp);
    }
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();


        builder
            .UseMauiApp<App>()
            .UseMauiCommunityToolkit()
            .ConfigureSyncfusionCore()
             .UseMauiCommunityToolkitMarkup()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            })

        .UseMauiMaps().ConfigureMauiHandlers(handlers =>
         {
#if ANDROID
			handlers.AddHandler<Microsoft.Maui.Controls.Maps.Map, TekTrackingCore.Platforms.Android.CustomMapHandler>();
#endif
         });
        //Routing.RegisterRoute("dashboard", typeof(MainPage));
        //Routing.RegisterRoute("login", typeof(LoginPage));

        builder.Services.AddSingleton<LoginViewModel>();
        builder.Services.AddSingleton<LoginPage>();

        builder.Services.AddSingleton<ProceedPage>();

        builder.Services.AddSingleton<MianPageViewModel>();
        builder.Services.AddSingleton<MainPage>();
        builder.Services.AddSingleton<BriefingViewModel>();
        builder.Services.AddSingleton<Briefing>();

        builder.Services.AddSingleton<StaticListItemViewModel>();
        builder.Services.AddSingleton<FormPageViewModel>();
        builder.Services.AddSingleton<FormPage>();
        builder.Services.AddSingleton<Hos>();

        builder.Services.AddSingleton<UserProfileViewModel>();
        builder.Services.AddSingleton<UserProfilePage>();
        builder.Services.AddTransient<SettingViewModelcs>();
        builder.Services.AddTransient<MapPinsView>();
        builder.Services.AddTransient<MapViewModel>();

        builder.Services.AddTransient<Setting>();

        //builder.Services.AddSingleton<StaticListItemPage>();

        builder.Services.AddSingleton<JSONWebService>();
        builder.Services.AddSingleton<DatabaseSyncService>();
        builder.Services.AddSingleton<InspectionService>();
        builder.Services.AddSingleton<BaseViewService>();
        //builder.Services.AddSingleton<AccordionViewModel>();
        builder.Services.AddSingleton<ExpandableView>();
        builder.Services.AddSingleton<StaticListItemService>();

        builder.Services.AddSingleton<IHttpsClientHandlerService, HttpsClientHandlerService>();

        builder.Services.AddSingleton<DataService>();
        builder.Services.AddSingleton<CompanyTreeViewBuilder>();
        builder.Services.AddTransient<CompanyPage>();
        builder.Services.AddSingleton<IUserProfileService, UserProfileServices>();
        builder.Services.AddSingleton<ISettingServerServices, SettingServerServices>();

        MauiApp app = builder.Build();
        app.Services.UseResolver();

        //DeviceDisplay.KeepScreenOn = true;

        return app;
    }

    public static void SetMainDashboardPage()
    {
        App.Current.MainPage = new AppShell();

    }
}

