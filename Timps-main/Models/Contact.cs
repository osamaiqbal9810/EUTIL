using Microsoft.Maui.Controls;
using System.ComponentModel;


namespace TekTrackingCore
{
    public class Contact : INotifyPropertyChanged
    {
        #region Fields

        private string contactName;
        private string callTime;
        private ImageSource contactImage;
        private bool isVisible = false;

        #endregion

        #region Properties

        public bool IsVisible
        {
            get { return isVisible; }
            set
            {
                isVisible = value;
                this.RaisedOnPropertyChanged("IsVisible");
            }
        }

        public string ContactName
        {
            get { return contactName; }
            set
            {
                if (contactName != value)
                {
                    contactName = value;
                    this.RaisedOnPropertyChanged("ContactName");
                }
            }
        }

        public string CallTime
        {
            get { return callTime; }
            set
            {
                if (callTime != value)
                {
                    callTime = value;
                    this.RaisedOnPropertyChanged("CallTime");
                }
            }
        }

        public ImageSource ContactImage
        {
            get { return this.contactImage; }
            set
            {
                this.contactImage = value;
                this.RaisedOnPropertyChanged("ContactImage");
            }
        }

        #endregion

        #region Constrator

        public Contact()
        {

        }

        public Contact(string Name)
        {
            contactName = Name;
        }

        #endregion

        #region Interface Member

        public event PropertyChangedEventHandler PropertyChanged;

        public void RaisedOnPropertyChanged(string _PropertyName)
        {
            if (PropertyChanged != null)
            {
                PropertyChanged(this, new PropertyChangedEventArgs(_PropertyName));
            }
        }

        #endregion
    }
}