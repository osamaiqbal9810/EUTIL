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

        Task<List<UserModel>> ReadUserDetail();
        Task<List<UserSignatureModel>> ReadUserSigDetail();
    }
}
