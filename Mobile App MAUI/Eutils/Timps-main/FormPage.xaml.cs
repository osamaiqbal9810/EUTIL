
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
    public FormPage(FormPageViewModel viewmodel)
    { 
        InitializeComponent();
        BindingContext = viewmodel;
        viewmodel.setRenderCallBack = RenderForm;
        service = new InspectionService();
       
    }

    public void RenderForm(string json)
    {
        if (json != null)
        {
            

            var result = JsonConvert.DeserializeObject<dynamic>(json);
            var opt = result.opt1;
            // var tab = opt[0].sections[0].section_name;
            var scrollView = new ScrollView();
            var verticalStackLayout = new VerticalStackLayout();
            verticalStackLayout.Spacing = 25;
            // verticalStackLayout.BackgroundColor = Color.FromRgb(232, 227, 227);
            foreach (var tab in opt)
            {
                foreach (var section in tab.sections)
                {
                    verticalStackLayout.Children.Add(new Label { Text = section.section_name, FontSize = 16, TextColor = Color.FromRgb(5, 5, 5), FontAttributes = FontAttributes.Bold });
                    foreach (var field in section.fields)
                    {
                        service.mapFields(verticalStackLayout, field); 
                    }

                }
            }
            Button button = new Button { Text = "Submit", VerticalOptions = LayoutOptions.Center, HorizontalOptions = LayoutOptions.Center };
            button.Clicked += async (sender, args) => service.OnsubmitButtonClicked();

            verticalStackLayout.Children.Add(button);

            verticalStackLayout.Paddings(25, 25, 25, 25);

            scrollView.Content = verticalStackLayout;
            Content = scrollView;

            //dynamic formObj = new JObject(result);
            //Console.WriteLine(formObj);
        }
    }
    


}