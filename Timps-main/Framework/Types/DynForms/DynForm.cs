
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore.Framework.Types.DynForms
{
    public class DynForm
    {
        private String formId;
        private String formName;
        private String formKey;
        private String formCode;
        private bool hasData = false;
        private List<DynFromControlDv> formControlList;
        private Dictionary<String, DynFromControlDv> formControlListMap;
        private Dictionary<String, String> currentValues;
        private Dictionary<String, String> copyCurrentValues;

        private bool dirty = false;
        private Dictionary<String, Object> hmBackupValues;
        private bool changeOnly = false;

        private bool defaultValuesExists;
        private Units selectedUnit;


        private String formCompleteId;


    }
}
