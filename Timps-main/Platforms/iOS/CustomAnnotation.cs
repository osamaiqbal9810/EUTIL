using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MapKit;
using Microsoft.Maui.Maps;
using UIKit;

namespace TekTrackingCore.Platforms.iOS
{

    public class CustomAnnotation : MKPointAnnotation { public Guid Identifier { get; set; } public UIImage? Image { get; set; } public required IMapPin Pin { get; set; } }
}
