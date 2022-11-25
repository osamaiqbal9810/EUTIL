using SQLite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace TekTrackingCore.Framework.Types
{
    [Table("applicationlookups")]
    public class StaticListItem
    {

        public int Id { get; set; }
        public string orgCode { get; set; }
        public string listName { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        public string optParam1 { get; set; }
        public string optParam2 { get; set; }


    }


}
