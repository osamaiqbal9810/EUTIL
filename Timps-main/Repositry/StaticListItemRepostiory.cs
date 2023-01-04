using SQLite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TekTrackingCore.Framework.Types;

namespace TekTrackingCore
{
    public class StaticListItemRepostiory
    {
        private string _dbPath;

        public string StatusMessage { get; set; }

        private SQLiteConnection conn;

        private void Init()
        {
            if (conn != null)
                return;

            conn = new SQLiteConnection(_dbPath);
            conn.CreateTable<StaticListItem>();
        }

        public StaticListItemRepostiory(string dbPath)
        {
            _dbPath = dbPath;
        }

        public void AddNewStaticListItem(string name)
        {
            int result = 0;
            try
            {

                Init();

                if (string.IsNullOrEmpty(name))
                    throw new Exception("Valid name required");

                result = conn.Insert(new StaticListItem { orgCode = name });
                result = 0;

                StatusMessage = string.Format("{0} record(s) added (Name: {1})", result, name);
            }
            catch (Exception ex)
            {
                StatusMessage = string.Format("Failed to add {0}. Error: {1}", name, ex.Message);
            }

        }

        public List<StaticListItem> GetAllList()
        {

            try
            {

            }
            catch (Exception ex)
            {
                StatusMessage = string.Format("Failed to retrieve data. {0}", ex.Message);
            }

            return new List<StaticListItem>();
        }
    }
}