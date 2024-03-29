using CommunityToolkit.Mvvm.Input;
using TekTrackingCore.Model;
using TekTrackingCore.Models;
using TekTrackingCore.Services;
using TekTrackingCore.ViewModels;

namespace TekTrackingCore.Views;

public partial class UserProfilePage : ContentPage
{
    private UserProfileServices userProfileServices;
    public UserProfilePage(UserProfileViewModel vm)
    {
        InitializeComponent();
        var abc = Preferences.Get(typeof(LoginInfo).ToString(), "");

        //lableField.Text = ;
        this.BindingContext = vm;

        userProfileServices = new UserProfileServices();

        AssignImage();


    }

    void OnBackToDashBoard(object sender, EventArgs args)
    {
        Shell.Current.GoToAsync($"//{nameof(Briefing)}");
    }


    public async void AssignImage()
    {
        var picData = await userProfileServices.ReadUserDetail();
        if (picData.Count>0)
        {
            imageStatus.Source = picData[0].picture;

        }
    }

 
     async void OnPicturess(object sender, EventArgs args)
    {

        UserModel userModel = new UserModel();
        var result = await FilePicker.PickAsync(new PickOptions
        {
            PickerTitle = "Pick Image Please",
            FileTypes = FilePickerFileType.Images
        });

        if (result == null)
            return;
       
        userModel.picture = result.FullPath;

        var stream = await result.OpenReadAsync();

        var readimagePath=await userProfileServices.ReadUserDetail();

        await userProfileServices.AddUserDetails(userModel);
        imageStatus.Source = ImageSource.FromStream(() => stream);

    }

    private async void Button_Clicked(object sender, EventArgs e)
    {
        await Shell.Current.GoToAsync($"//{nameof(Briefing)}");
    }

  

}