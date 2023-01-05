namespace TekTrackingCore
{
    public interface IMapView : IView
    {
    }

    public partial class MapView : View, IMapView
    {
        public List<Location> markerPositions;


    }
}