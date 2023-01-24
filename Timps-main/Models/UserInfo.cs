using SQLite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore.Models
{
    public class UserInfo
    {
        [PrimaryKey]
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool isLoading { get; set; }
        public DateTime CreationTime { get; set; }
        public string Token { get; set; }

    }
}
