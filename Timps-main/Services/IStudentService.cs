using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Models;

namespace TekTrackingCore.Services
{
    public interface IStudentService
    {




        Task<int> AddUserDetails(UserModel userModel);

        Task<int> AddUserSignature(UserSignatureModel userSignatureModel);

        Task<int> AddServerSetting(SettingModel settingModel);

        Task<List<UserModel>> ReadUserDetail();

        Task<List<SettingModel>> ReadSettingsDetails();

        Task<int> DeleteServer(SettingModel settingModel);


        Task<List<UserSignatureModel>> ReadUserSigDetail();

    }
}
