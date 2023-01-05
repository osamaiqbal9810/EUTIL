
using CommunityToolkit.Maui.Views;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using TekTrackingCore.Models;
using TekTrackingCore.Services;

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

    public async void PopupSave(object sender, EventArgs e){
        SettingModel settingModel = new SettingModel();


        settingModel.DisplayName = displayName.Text;
        settingModel.PortNumber = int.Parse(portNumber.Text);
        settingModel.ServerAdress = serverAddress.Text;


        await studentService.AddServerSetting(settingModel);

        Close();
    }
}