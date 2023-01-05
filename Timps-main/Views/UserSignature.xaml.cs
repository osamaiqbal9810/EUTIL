
using CommunityToolkit.Mvvm.Input;
using Microsoft.Maui.Graphics.Platform;

namespace TekTrackingCore.Views;

public partial class UserSignature : ContentPage
{
    public UserSignature()
    {
        InitializeComponent();
    }



    private void ClearDrawing(object sender, EventArgs e)
    {
        drawingView.Clear();
    }

    private async void ConvertToImage(object sender, EventArgs e)
    {
        var stream = await drawingView.GetImageStream(300, 300);
        //image.Source = ImageSource.FromStream(() => stream);

        string path = FileSystem.Current.AppDataDirectory;
        string targetFile = System.IO.Path.Combine(FileSystem.Current.AppDataDirectory, "abc");

        string localFilePath = Path.Combine(FileSystem.CacheDirectory, "abc");


        Microsoft.Maui.Graphics.IImage newimage;


        using FileStream localFileStream = File.OpenWrite(localFilePath);

        {
            newimage = PlatformImage.FromStream(stream);

            newimage.Save(localFileStream);
            localFileStream.Close();
        }




        //using FileStream InputStream = System.IO.File.OpenRead(localFilePath);
        //using StreamReader reader = new StreamReader(InputStream);

        //var text = await reader.ReadToEndAsync();

        image.Source = ImageSource.FromFile(localFilePath);
        //Console.WriteLine(text, "path");


        imageActionsPanel.IsVisible = false;
        drawingView.IsVisible = false;
        drawingView.Clear();

        image.IsVisible = true;
        reDrawButton.IsVisible = true;

    }

    private void ReDraw(object sender, EventArgs e)
    {
        image.IsVisible = false;
        reDrawButton.IsVisible = false;
        drawingView.IsVisible = true;
        imageActionsPanel.IsVisible = true;
    }
}