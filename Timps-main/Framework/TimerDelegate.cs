
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Framework.Types;

namespace TekTrackingCore.Framework
{

    public class TimerDelegate<T>
    {
        public event EventHandler<T> OnCompleted;
        public bool IsRunning { get; set; }

        public TimerDelegate()
        { }

        public TimerDelegate(Func<T> fn, int interval)
        {
            Func = fn;
            Interval = interval;
        }

        public async void Start()
        {
            if (Func == null)
                throw new ArgumentNullException();
            if (Interval == 0) throw new ArgumentNullException();
            IsRunning = true;

            while (IsRunning)
            {
                await Task.Delay(Interval);
                try
                {
                    var result = Func();
                    OnCompleted(this, result);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                    return; // handle
                }
            }
        }
        public void Stop()
        {
            IsRunning = false;
        }

        public Func<T> Func { get; set; }

        public int Interval { get; set; }
    }
}
