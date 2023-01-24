
using CommunityToolkit.Maui.Markup;

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
            {//
                formvalue = new Dictionary<string, string>();
                var result = JsonConvert.DeserializeObject<dynamic>(json);
                var opt = result.opt1;
                // var tab = opt[0].sections[0].section_name;
                var scrollView = new ScrollView();
                var verticalStackLayout = new VerticalStackLayout();
                verticalStackLayout.Spacing = 25;
                // verticalStackLayout.BackgroundColor = Color.FromRgb(232, 227, 227);
                var unitOb = Preferences.Get("SelectedUnit", "");
                var unitObj = JsonConvert.DeserializeObject<Sample.Models.Unit>(unitOb);

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

                //dynamic formObj = new JObject(result);
                //Console.WriteLine(formObj);
            }
        }catch(Exception e)
        {
            Console.WriteLine("renderform " + e);
        }
    }

   


}