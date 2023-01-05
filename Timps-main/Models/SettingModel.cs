using SQLite;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore.Models
{
    public class SettingModel: INotifyPropertyChanged
    {
        [PrimaryKey, AutoIncrement]
        public int UserId { get; set; }
        public string DisplayName { get; set; }
        public string ServerAdress { get; set; }
        public int PortNumber { get; set; }

        public bool isCheckedOrNot { get { return _isCheckedOrNot; } set { SetProperty(ref _isCheckedOrNot, value); } }
        private bool _isCheckedOrNot;

        public event PropertyChangedEventHandler PropertyChanged;
        public bool SetProperty<T>(ref T field, T value, [CallerMemberName] string name = null)
        {
            if (EqualityComparer<T>.Default.Equals(field, value))
            {
                return false;
            }
            field = value;
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
            return true;
        }

        public bool checkStatusTrue()
        {
            isCheckedOrNot = true;
            return isCheckedOrNot;
        }

        public bool checkStatusFalse()
        {
            isCheckedOrNot = false;
            return isCheckedOrNot;
        }

    }
}
