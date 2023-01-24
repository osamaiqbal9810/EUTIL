using SQLite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore.Sample.Models
{
    public class ReportModel
    {
        [PrimaryKey]
        public string Id { get; set; }
        public string Title { get; set; }
        public string startInspBtnState { get; set; }
        public bool PlanInspectionDone { get; set; }
        public string PlanStatus { get; set; }
        public bool inspectionBtnStatus { get; set; }
    }
}
