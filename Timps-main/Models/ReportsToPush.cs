using SQLite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore.Models
{
    public class ReportsToPush
    {
        [AutoIncrement, PrimaryKey]
        public int Id { get; set; }

        public string UnitId { get; set; }
        public string WPId { get; set; }
        public string Content { get; set; }
    }

    public class InprogressToPush
    {
        [AutoIncrement, PrimaryKey]
        public int Id { get; set; }

        public string UnitId { get; set; }
        public string WPId { get; set; }
        public string Content { get; set; }
    }


}
