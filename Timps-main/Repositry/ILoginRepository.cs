using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Models;

namespace TekTrackingCore.Repositry
{
    public interface ILoginRepository
    {

        Task<UserInfo> Login(string username, string password, Action<bool> isLoading ,Action<string, bool> emailStatus);
        public bool IsAlreadyLoggedIn();
        public bool IsLoadingLogin(bool status);
        public void  Logout();
        public string BtnText();
        public Task Proceed();
    }
}
