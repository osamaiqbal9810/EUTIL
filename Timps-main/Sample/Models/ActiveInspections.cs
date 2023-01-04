using SQLite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore.Sample.Models
{
    public class ActiveInspections
    {
        [PrimaryKey]
        public string Id { get; set; }
        public string Title { get; set; }
    }
}
