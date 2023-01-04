using Newtonsoft.Json;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;
using TekTrackingCore.Sample.Models;

namespace TekTrackingCore.Framework.Types
{
    public class StaticListItemDTO
    {
        [JsonPropertyName("_id")]
        public string Id;

        [JsonPropertyName("tenantId")]
        public string TenantId;

        [JsonPropertyName("listName")]
        public string ListName;

        [JsonPropertyName("code")]
        public string Code;

        [JsonPropertyName("description")]
        public string Description;

        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt;

        [JsonPropertyName("updatedAt")]
        public DateTime UpdatedAt;

        [JsonPropertyName("__v")]
        public int V;

        [JsonPropertyName("opt1")]
        public object Opt1;

        [JsonPropertyName("opt2")]
        public object Opt2;
    }

    public class MessageListResponseDTO
    {
        [JsonPropertyName("ts")]
        public string Ts { get; set; }

        [JsonPropertyName("result")]
        public List<List<StaticListItemDTO1>> Result { get; set; }
    }

    public class Unit
    {
        [JsonProperty("unitId")]
        public string UnitId { get; set; }

        [JsonProperty("assetId")]
        public string AssetId { get; set; }

        [JsonProperty("coordinates")]
        public List<List<double>> Coordinates { get; set; }

        [JsonProperty("assetType")]
        public string AssetType { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("parent_id")]
        public string ParentId { get; set; }

        [JsonProperty("locationType")]
        public string LocationType { get; set; }

        [JsonProperty("inspectionDate")]
        public string InspectionDate { get; set; }

        [JsonProperty("inspectionStatus")]
        public object InspectionStatus { get; set; }

        [JsonProperty("testForm")]
        public List<TestForm> TestForm { get; set; }

        [JsonProperty("inspection_type")]
        public string InspectionType { get; set; }

        [JsonProperty("frequency")]
        public string Frequency { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }
    }
    public class StaticListItemDTO1 : INotifyPropertyChanged
    {
        [JsonPropertyName("tenantId")]
        public string TenantId { get; set; }

        [JsonPropertyName("listName")]
        public string ListName { get; set; }

        [JsonPropertyName("code")]
        public string Code { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("optParam1")]
        public string OptParam1 { get; set; }

        [JsonPropertyName("optParam2")]
        public string OptParam2 { get; set; }


        [JsonPropertyName("contactName")]
        public string ContactName { get; set; }

        [JsonPropertyName("isvisible")]
        public bool IsVisible { get { return _isVisible; } set { SetProperty(ref _isVisible, value); } }
        private bool _isVisible;
        internal IEnumerable<object> tasks;

        public StaticListItemDTO1()
        {
            IsVisible = false;

        }



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
    }
}

