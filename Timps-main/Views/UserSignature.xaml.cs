
using TekTrackingCore.Models;
using TekTrackingCore.Services;

namespace TekTrackingCore.Views;

public partial class UserSignature : ContentPage
{
   
    public UserSignature()
	{
		InitializeComponent();
      
    }

    private async void DrawingView_DrawingLineCompleted(object sender, CommunityToolkit.Maui.Core.DrawingLineCompletedEventArgs e)
    {
        UserSignatureModel userSignatureModel = new UserSignatureModel();
        var stream = await DrawingViewControl.GetImageStream(GestureImage.Width, GestureImage.Height);
       var xyz= stream.ReadByte();
        GestureImage.Source = ImageSource.FromStream(() => stream);
        Preferences.Set("userSignature", stream.ToString());
       string abc= Preferences.Get("userSignature", "");
     
       
      
  


    }


    //public async void onSignatureClicked(object sender, CommunityToolkit.Maui.Core.DrawingLineCompletedEventArgs e)
    //{
    //    UserSignatureModel userSignatureModel = new UserSignatureModel();

    //    userSignatureModel.signature = imageView.Source.ToString();

    //    await studentService.AddUserSignature(userSignatureModel);

    //}

    //public async void btnLogin_Clicked(object sender, System.EventArgs e)
    //{
    //    UserSignatureModel userSignatureModel = new UserSignatureModel();

    //    //userSignatureModel.signature = imageView.Source;

    //    //await studentService.AddUserSignature(userSignatureModel);
    //}

    //async void GetCurrentDrawingViewImageClicked(object sender, EventArgs e)
    //{
       

    //}

}