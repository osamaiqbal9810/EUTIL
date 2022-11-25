using TekTrackingCore.Framework;
using TekTrackingCore.Services;

namespace TekTrackingCore.ViewModels;

public class MianPageViewModel : BaseViewModel
{
    public MianPageViewModel()
    {

        DatabaseSyncService service = ServiceResolver.ServiceProvider.GetRequiredService<DatabaseSyncService>();
        service.Start();
    }
}