using CommunityToolkit.Maui.Views;
using SQLite;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore.Models
{
    public class UserSignatureModel
    {
        [PrimaryKey, AutoIncrement]
        public int UserId { get; set; }
        public string signature { get; set; }
    }
}
