using Newtonsoft.Json.Linq;
using SQLite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore.Sample.Models
{
    public class UnitModel
    {
        [PrimaryKey, AutoIncrement]
        public int Index { get; set; }
        public string AssetId { get; set; }
        public string AssetName { get; set; }
        public string Values { get; set; }
    }
}
