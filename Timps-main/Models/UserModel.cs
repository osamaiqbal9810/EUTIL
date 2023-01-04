using SQLite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore.Models
{
    public class UserModel
    {
        [PrimaryKey,AutoIncrement]
        public int UserId { get; set; }
        public string picture { get; set; }
    

    }
}
