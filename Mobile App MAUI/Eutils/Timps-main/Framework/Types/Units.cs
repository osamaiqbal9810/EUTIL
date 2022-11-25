
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Framework.Types.DynForms;

namespace TekTrackingCore.Framework.Types
{
    public class Units
    {
        private String trackId;
        private String unitId;
        private String description;
        private String assetType;
        private String assetTypeClassify = "";
        private String joFormData; //JSON FormData
        private Dictionary<String, String> selection;

        private AssetType assetTypeObj;
        private String start;
        private String end;
        private String parentId;
        private Units parentUnit;
        private String issueCounter = "0";
        //private UnitAttributes attributes;
        private List<DynFormDv> appForms;
        private Dictionary<String, Object> hmBackupValues;
        private bool changeOnly = false;
        private String startMarker;
        private String endMarker;
        //private DynFormListDv defaultFormValues;
        //private List<UnitsTestOpt> testList = new ArrayList<>();
        //private List<UnitsDefectsOpt> defectsList;
        private Dictionary<String, DynForm> appFormListMap;
        private bool loadMinimum = false;
        private bool freeze = false;
        // private UnitsGroup unitsGroup;
        private bool visible = true;
        //   private List<ATIVDefect> ativDefects;
        //  private List<ATIVDefect> ativIssues;
        // private List<Equipment> equipmentList;
        private List<Units> children;
        private List<DynForm> equipmentForms;
        private Dictionary<String, DynForm> equipmentFormsHM = new Dictionary<String, DynForm>();

    }
}
