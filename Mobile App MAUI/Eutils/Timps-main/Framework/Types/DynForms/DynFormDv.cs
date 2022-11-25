using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore.Framework.Types.DynForms
{
    public class DynFormDv
    {

        private String id = "";
        private List<DynFromControlDv> controlList;
        private Dictionary<String, String> controlValues;

        public void setControlValues(Dictionary<String, String> controlValues)
        {
            this.controlValues = controlValues;
        }

        public Dictionary<String, String> getControlValues()
        {
            return controlValues;
        }
        public void setControlList(List<DynFromControlDv> controlList)
        {
            this.controlList = controlList;
        }

        public List<DynFromControlDv> getControlList()
        {
            return controlList;
        }

        public void setId(String id)
        {
            this.id = id;
        }

        public String getId()
        {
            return id;
        }
    }
}
