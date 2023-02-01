using Microsoft.Maui.Controls.Maps;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore
{
    public class CustomPin : Pin
    {

        public static readonly BindableProperty UnitIdProperty =
            BindableProperty.Create(nameof(UnitId), typeof(string), typeof(CustomPin),
                                    propertyChanged: OnUnitIdChanged);

        public string UnitId
        {
            get => (string)GetValue(UnitIdProperty);
            set => SetValue(UnitIdProperty, value);
        }
        /// <summary>
        /// 
        /// </summary>
        public static readonly BindableProperty ImageSourceProperty =
            BindableProperty.Create(nameof(ImageSource), typeof(ImageSource), typeof(CustomPin),
                                    propertyChanged: OnImageSourceChanged);

        public ImageSource? ImageSource
        {
            get => (ImageSource?)GetValue(ImageSourceProperty);
            set => SetValue(ImageSourceProperty, value);
        }

        public Microsoft.Maui.Maps.IMap? Map { get; set; }

        static async void OnImageSourceChanged(BindableObject bindable, object oldValue, object newValue)
        {
            var control = (CustomPin)bindable;
            if (control.Handler?.PlatformView is null)
            {
                // Workaround for when this executes the Handler and PlatformView is null
                control.HandlerChanged += OnHandlerChanged;
                return;
            }

#if IOS || MACCATALYST
            //await control.AddAnnotation();
#else
		await Task.CompletedTask;
#endif

            void OnHandlerChanged(object? s, EventArgs e)
            {
                OnImageSourceChanged(control, oldValue, newValue);
                control.HandlerChanged -= OnHandlerChanged;
            }
        }

        //

        static async void OnUnitIdChanged(BindableObject bindable, object oldValue, object newValue)
        {
            var control = (CustomPin)bindable;
            if (control.Handler?.PlatformView is null)
            {
                // Workaround for when this executes the Handler and PlatformView is null
                control.HandlerChanged += OnHandlerChanged;
                return;
            }

#if IOS || MACCATALYST
            //await control.AddAnnotation();
#else
		await Task.CompletedTask;
#endif

            void OnHandlerChanged(object? s, EventArgs e)
            {
                OnUnitIdChanged(control, oldValue, newValue);
                control.HandlerChanged -= OnHandlerChanged;
            }
        }
    }
}
