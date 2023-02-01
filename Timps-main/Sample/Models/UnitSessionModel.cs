

using SQLite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore.Sample.Models
{
    public class UnitSessionModel
    {

        [PrimaryKey]
        public string PR_Key { get; set; }
        public string UnitId { get; set; }
        public string UserID { get; set; }
        public string InspectionType { get; set; }
        public string WpId { get; set; }
        public string AssetName { get; set; }
        public string AssetStatus { get; set; }
        public bool AssetInspectionDone { get; set; }
        public bool AssetInspectionSaved { get; set; }
        public bool OfflineInspectionDone { get; set; }
        public bool StartInspButtonStatus { get; set; }
    }
}
