using SQLite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TekTrackingCore.Models;

namespace TekTrackingCore.Services
{
    public class SettingServerServices:ISettingServerServices
    {
        private SQLiteAsyncConnection _dbConnection;
        private CreateTableResult SettingModelInfo;

        public async Task SetUpDb()
        {
            if (_dbConnection == null)
            {
                string dbPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Eutility.db3");
                _dbConnection = new SQLiteAsyncConnection(dbPath);

                SettingModelInfo = await _dbConnection.CreateTableAsync<SettingModel>();
            }

            if (SettingModelInfo != SQLite.CreateTableResult.Created || SettingModelInfo != CreateTableResult.Migrated)
            {
                SettingModelInfo = await _dbConnection.CreateTableAsync<SettingModel>();
            }


        }


        public async Task<int> AddServerSetting(SettingModel settingModel)
        {
            await SetUpDb();
            return await _dbConnection.InsertAsync(settingModel);
        }

        public async Task<List<SettingModel>> ReadSettingsDetails()
        {
            await SetUpDb();
            return await _dbConnection.Table<SettingModel>().ToListAsync();
        }


        public async Task<int> DeleteServer(SettingModel settingModel)
        {
            await SetUpDb();
            return await _dbConnection.DeleteAsync(settingModel);
        }

    }
}
