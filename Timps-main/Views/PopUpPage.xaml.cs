using CommunityToolkit.Maui.Views;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.ComponentModel;
using TekTrackingCore.Models;
using TekTrackingCore.Services;
using TekTrackingCore.ViewModels;
namespace TekTrackingCore.Views;
public partial class PopUpPage : Popup
{

    private StudentService studentService;

    public PopUpPage()
    {
        InitializeComponent();

        studentService = new StudentService();
        //ReaduserDetails();
        //ReadSettingsDetails();
    }
    public void PopupClosed(object sender, EventArgs e)
    {
        Close();
    }
    public async void PopupSave(object sender, EventArgs e)
    {
        SettingModel settingModel = new SettingModel();
        if (displayName.Text == null || displayName.Text == null)
        {
            Close();

        }
        else
        {
            settingModel.DisplayName = displayName.Text;
            settingModel.PortNumber = int.Parse(portNumber.Text);
            settingModel.ServerAdress = serverAddress.Text;
            await studentService.AddServerSetting(settingModel);
            //await Shell.Current.GoToAsync(nameof(Setting));
            var page = Application.Current.MainPage.Navigation.NavigationStack.LastOrDefault();
            // Load new page
            await Shell.Current.GoToAsync(nameof(Setting), false);
            // Remove old page
            Application.Current.MainPage.Navigation.RemovePage(page);
            Close();

        }



    }
}