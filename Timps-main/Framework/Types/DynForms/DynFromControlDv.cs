using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore.Framework.Types.DynForms
{
    public class DynFromControlDv
    {
        private String id;
        private String value;

        public void setId(String id)
        {
            this.id = id;
        }

        public String getId()
        {
            return id;
        }

        public void setValue(String value)
        {
            this.value = value;
        }

        public String getValue()
        {
            return value;
        }
    }
}
