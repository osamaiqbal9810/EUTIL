using System;
using MapKit;
using Microsoft.Maui.Handlers;

namespace TekTrackingCore.Handlers
{
    public partial class MapHandler : ViewHandler<MapView, MKMapView>
    {
        public MapHandler(IPropertyMapper mapper, CommandMapper commandMapper = null) : base(mapper, commandMapper)
        { }

        protected override MKMapView CreatePlatformView()
        {
            return new MKMapView(CoreGraphics.CGRect.Empty);
        }

        protected override void ConnectHandler(MKMapView PlatformView)
        { }

        protected override void DisconnectHandler(MKMapView PlatformView)
        {
            // Clean-up the native view to reduce memory leaks and memory usage
            if (PlatformView.Delegate != null)
            {
                PlatformView.Delegate.Dispose();
                PlatformView.Delegate = null;
            }

            PlatformView.RemoveFromSuperview();
        }
    }
}

