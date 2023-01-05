using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SQLite;
using TekTrackingCore.Models;

namespace TekTrackingCore.Services
{
    public class StudentService : IStudentService
    {
        private SQLiteAsyncConnection _dbConnection;

        public async Task SetUpDb()
        {
            if (_dbConnection == null)
            {
                string dbPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Eutility.db3");
                _dbConnection = new SQLiteAsyncConnection(dbPath);
                await _dbConnection.CreateTableAsync<UserModel>();
                await _dbConnection.CreateTableAsync<UserSignatureModel>();
                await _dbConnection.CreateTableAsync<SettingModel>();
            }

        }
        public StudentService()
        {
            SetUpDb();
        }

        public Task<int> AddUserDetails(UserModel userModel)
        {
            return _dbConnection.InsertAsync(userModel);
        }


        public async Task<int> AddUserSignature(UserSignatureModel userSignatureModel)
        {
            await SetUpDb();
            return await _dbConnection.InsertAsync(userSignatureModel);
        }

        public async Task<List<UserSignatureModel>> ReadUserSigDetail()
        {
            await SetUpDb();
            return await _dbConnection.Table<UserSignatureModel>().ToListAsync();
        }
        public async Task<List<UserModel>> ReadUserDetail()
        {
            await SetUpDb();
            return await _dbConnection.Table<UserModel>().ToListAsync();
        }


        public Task<int> AddServerSetting(SettingModel settingModel)
        {
            return _dbConnection.InsertAsync(settingModel);
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
