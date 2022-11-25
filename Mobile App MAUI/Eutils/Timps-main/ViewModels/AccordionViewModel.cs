using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using Microsoft.Maui.Controls;
using System.Text;


namespace TekTrackingCore
{
    public class AccordionViewModel : INotifyPropertyChanged
    {
        #region Properties

        public ObservableCollection<Contact> ContactsInfo { get; set; }

        #endregion

        #region Constructor

        public AccordionViewModel()
        {
            ContactsInfo = new ObservableCollection<Contact>();
            int i = 0;
            foreach (var cusName in CustomerNames)
            {
                if (counter == 13)
                    counter = 1;
                var contact = new Contact(cusName);
                contact.CallTime = CallTime[i];
                contact.ContactImage = "people_circle" + counter + ".png";
                i++;
                ContactsInfo.Add(contact);
                counter++;
            }
        }

        #endregion

        #region Fields

        int counter = 11;

        string[] CustomerNames = new string[] {
            "Kyle",
            "Irene",
            "Gina",
            "Katie",
            "Victoria",
            "Lily",
            "Torrey",
            "Lena",
            "Violet",
            "Daniel",
            "Lucy",
            "Brenda",
            "Danielle",
            "Howard",
            "Fiona",
            "Holly",
            "Liz",
            "Marley",
            "Jack",
            "Pete",
            "Vince",
            "Steve",
            "Katherin",
            "Aliza",
            "Masona",
            "Larry",
            "Lia",
            "Jayden ",
            "Ethani",
            "Noah ",
            "John",
            "Rose",
            "Erin"
        };

        string[] CallTime = new string[]
        {
            "Tunisia, 1 days ago",
            "Colombia, 1 days ago",
            "Fiji, 1 days ago",
            "Belgium, 1 days ago",
            "Japan, 1 days ago",
            "Argentina, 2 days ago",
            "Mexico, 2 days ago",
            "Guinea, 2 days ago",
            "Australia, 2 days ago",
            "Uruguay, 2 days ago",
            "Denmark, 3 days ago",
            "Peru, 3 days ago",
            "Greece, 3 days ago",
            "Austria, 3 days ago",
            "Hungary, 3 days ago",
            "Japan, 4 days ago",
            "Malaysia, 4 days ago",
            "Bermuda, 4 days ago",
            "Egypt, 4 days ago",
            "Philippines, 4 days ago",
            "Sweden, 5 days ago",
            "Vietnam, 5 days ago",
            "Yemen, 5 days ago",
            "Nepal, 5 days ago",
            "Kenya, 5 days ago",
            "Iceland, 6 days ago",
            "Canada, 6 days ago",
            "Angola, 6 days ago",
            "Italy, 6 days ago",
            "Monaco, 6 days ago",
            "Sudan, 1 week ago",
            "Togo, 1 week ago",
            "Benin, 1 week ago"
        };

        #endregion

        #region Interface Member

        public event PropertyChangedEventHandler PropertyChanged;

        public void OnPropertyChanged(string name)
        {
            if (this.PropertyChanged != null)
                this.PropertyChanged(this, new PropertyChangedEventArgs(name));
        }

        #endregion
    }
}
