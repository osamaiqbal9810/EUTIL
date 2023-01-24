using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore.Models
{
    public class Positions
    {   
        public string Address { get; set; }
        public string Description { get; set; }
        public Location Location { get; set; }

        public string Status { get; set; }
    }
}
