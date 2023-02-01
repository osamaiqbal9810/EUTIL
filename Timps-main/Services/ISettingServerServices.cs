using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Models;

namespace TekTrackingCore.Services
{
        public interface ISettingServerServices
        {
            Task<int> AddServerSetting(SettingModel settingModel);
            Task<List<SettingModel>> ReadSettingsDetails();
            Task<int> DeleteServer(SettingModel settingModel);
    }
}
