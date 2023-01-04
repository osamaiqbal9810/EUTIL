using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Maui.Controls;
using Syncfusion.Maui.ListView.Helpers;
using TekTrackingCore.Framework.Types;
using TekTrackingCore.Sample.Models;

namespace TekTrackingCore
{
    class SfListViewAccordionBehavior : Behavior<ContentPage>
    {
        #region Fields

        private WorkPlanDto tappedItem;
        private Syncfusion.Maui.ListView.SfListView listview;
        #endregion

        #region Override Methods

        protected override void OnAttachedTo(ContentPage bindable)
        {
            listview = bindable.FindByName<Syncfusion.Maui.ListView.SfListView>("listView");
            listview.ItemTapped += ListView_ItemTapped;
        }

        protected override void OnDetachingFrom(BindableObject bindable)
        {
            listview.ItemTapped -= ListView_ItemTapped;
            listview = null;
        }

        #endregion

        #region Private Methods

        private void ListView_ItemTapped(object sender, Syncfusion.Maui.ListView.ItemTappedEventArgs e)
        {
            if (tappedItem != null && tappedItem.IsVisible)
            {
                var previousIndex = listview.DataSource.DisplayItems.IndexOf(tappedItem);

                tappedItem.IsVisible = false;


                if (DeviceInfo.Platform != DevicePlatform.MacCatalyst)
                    listview.RefreshItem(previousIndex, previousIndex, false);
            }

            if (tappedItem == (e.DataItem as WorkPlanDto))
            {
                if (DeviceInfo.Platform == DevicePlatform.MacCatalyst)
                {
                    var previousIndex = listview.DataSource.DisplayItems.IndexOf(tappedItem);
                    listview.RefreshItem(previousIndex, previousIndex, false);
                }

                tappedItem = null;
                return;
            }

            tappedItem = e.DataItem as WorkPlanDto;
            tappedItem.IsVisible = true;

            if (DeviceInfo.Platform == DevicePlatform.MacCatalyst)
            {
                var visibleLines = this.listview.GetVisualContainer().ScrollRows.GetVisibleLines();
                var firstIndex = visibleLines[visibleLines.FirstBodyVisibleIndex].LineIndex;
                var lastIndex = visibleLines[visibleLines.LastBodyVisibleIndex].LineIndex;
                listview.RefreshItem(firstIndex, lastIndex, false);
            }
            else
            {
                var currentIndex = listview.DataSource.DisplayItems.IndexOf(e.DataItem);
                listview.RefreshItem(currentIndex, currentIndex, false);
            }
        }
        #endregion
    }
}
