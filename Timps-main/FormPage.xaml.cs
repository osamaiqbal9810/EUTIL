
using CommunityToolkit.Maui.Markup;
using Microsoft.Maui.Layouts;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using TekTrackingCore.Framework;
using TekTrackingCore.Sample.Models;
using TekTrackingCore.Services;
using TekTrackingCore.ViewModels;

namespace TekTrackingCore;

public partial class FormPage : ContentPage
{
    private InspectionService service;
    private Dictionary<string, string> formvalue = new Dictionary<string, string>();
    public string selectedWP;
    public string selectedUnit;
    public FormPage(FormPageViewModel viewmodel, InspectionService pService)
    { 
        InitializeComponent();
        BindingContext = viewmodel;
        viewmodel.setRenderCallBack = RenderForm;
        viewmodel.setSelectedWPlanCallBack = SelectedWPCallback;
        viewmodel.setUnitCallBack = SelectedUnitCallback;
        service = pService;    
    }

    public void SelectedWPCallback(string wp)
    {
        selectedWP = wp;
    }

    public void SelectedUnitCallback(string unit)
    {
        selectedUnit = unit;
    }
    public async void RenderForm(string json)
    {
        try
        {
            if (json != null)
            {
                var result = JsonConvert.DeserializeObject<dynamic>(json);
                var opt = result.opt1;
                var scrollView = new ScrollView();
                var verticalStackLayout = new VerticalStackLayout();
                verticalStackLayout.Spacing = 25;

                VerticalStackLayout formPageRow1 = new VerticalStackLayout();
                formPageRow1.BackgroundColor = Colors.LightGray;
                formPageRow1.Padding = 10;

                HorizontalStackLayout formPageHeaderInternal1 = new HorizontalStackLayout();
                HorizontalStackLayout formPageHeaderInternal2 = new HorizontalStackLayout();
                HorizontalStackLayout formPageHeaderInternal3 = new HorizontalStackLayout();
                HorizontalStackLayout formPageHeaderInternal4 = new HorizontalStackLayout();

                formPageHeaderInternal1.Margins(0, 0, 0, 10);
                formPageHeaderInternal2.Margins(0, 0, 0, 10);
                formPageHeaderInternal3.Margins(0, 0, 0, 10);
                formPageHeaderInternal4.Margins(0, 0, 0, 0);

                Label unitIdLabel = new Label();
                unitIdLabel.FontAttributes = FontAttributes.Bold;
                Label unitId= new Label();

                Label assetTypeLabel = new Label();
                assetTypeLabel.FontAttributes = FontAttributes.Bold;
                Label assetType = new Label();

                Label inspectionTypeLabel = new Label();
                inspectionTypeLabel.FontAttributes = FontAttributes.Bold;
                Label inspectionType = new Label();

                Label locationTypeLabel = new Label();
                locationTypeLabel.FontAttributes = FontAttributes.Bold;
                Label locationType = new Label();

                var unitOb = Preferences.Get("SelectedUnit", "");
                Unit unitObj = null;
                if (selectedUnit != null)
                {
                    unitObj = JsonConvert.DeserializeObject<Sample.Models.Unit>(selectedUnit);
                }
                else
                {
                    unitObj = JsonConvert.DeserializeObject<Sample.Models.Unit>(unitOb);
                }
                if (unitObj != null)
                {
                    unitId.Text = unitObj.UnitId;
                    assetType.Text = unitObj.AssetType;
                    inspectionType.Text = unitObj.InspectionType;
                    locationType.Text = unitObj.LocationType;

                    unitIdLabel.Text = "Asset Name: ";
                    formPageHeaderInternal1.Children.Add(unitIdLabel);
                    formPageHeaderInternal1.Children.Add(unitId);

                    assetTypeLabel.Text = "Asset Type: ";
                    formPageHeaderInternal2.Children.Add(assetTypeLabel);
                    formPageHeaderInternal2.Children.Add(assetType);

                    formPageRow1.Children.Add(formPageHeaderInternal1);
                    formPageRow1.Children.Add(formPageHeaderInternal2);

                    inspectionTypeLabel.Text = "Inspection Type: ";
                    formPageHeaderInternal3.Children.Add(inspectionTypeLabel);
                    formPageHeaderInternal3.Children.Add(inspectionType);

                    locationTypeLabel.Text = "Location Type: ";
                    formPageHeaderInternal4.Children.Add(locationTypeLabel);
                    formPageHeaderInternal4.Children.Add(locationType);

                    formPageRow1.Children.Add(formPageHeaderInternal3);
                    formPageRow1.Children.Add(formPageHeaderInternal4);

                    Picker separator = new Picker();
                    separator.IsEnabled = false;
                  
                    formPageRow1.Children.Add(separator);

                    verticalStackLayout.Children.Add(formPageRow1);
                    var savedFormsList = new List<UnitModel>();
                    savedFormsList = await service.GetSavedUnitForms();
                    var foundForm = savedFormsList.Find(list => list.AssetId == unitObj.AssetId && list.InspType == unitObj.InspectionType);

                    JArray savedFormValues = new JArray();
                    if (foundForm != null)
                    {
                        var values = foundForm.Values;
                        if (values != null)
                        {
                            savedFormValues = JsonConvert.DeserializeObject<dynamic>(values);
                        }

                    }

                    foreach (var tab in opt)
                    {
                        foreach (var section in tab.sections)
                        {
                            verticalStackLayout.Children.Add(new Label { Text = section.section_name, FontSize = 16, TextColor = Color.FromRgb(5, 5, 5), FontAttributes = FontAttributes.Bold });
                            foreach (var field in section.fields)
                            {
                                service.mapFields(verticalStackLayout, field, savedFormValues);
                            }

                        }
                    }
                    result = null;
                    opt = null;
                    unitOb = null;
                    foundForm = null;
                    savedFormValues = null;
                    Button saveButton = new Button { Text = "Save", VerticalOptions = LayoutOptions.Center, HorizontalOptions = LayoutOptions.Center };
                    saveButton.Clicked += async (sender, args) => service.OnsaveButtonClicked();

                    Button button = new Button { Text = "Submit", VerticalOptions = LayoutOptions.Center, HorizontalOptions = LayoutOptions.Center };
                    button.Clicked += async (sender, args) => service.OnsubmitButtonClicked(selectedWP, selectedUnit);

                    HorizontalStackLayout hLayout = new HorizontalStackLayout();
                    hLayout.Spacing = 10;
                    hLayout.Children.Add(button);
                    hLayout.Children.Add(saveButton);

                    verticalStackLayout.Children.Add(hLayout);
                    verticalStackLayout.Paddings(25, 25, 25, 25);

                    scrollView.Content = verticalStackLayout;
                    Content = scrollView;
                }

                //dynamic formObj = new JObject(result);
                //Console.WriteLine(formObj);
            }
        }catch(Exception e)
        {
            Console.WriteLine("renderform " + e);
        }
    }

   


}
}