using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore.Framework.Types
{
    public class AssetType
    {


        private String assetType;
        private String assetTypeClassify;
        private String instructions;
        private bool isLocation = false;
        private DefectCode defectCodes;

        private Form form;
        private bool isInspectable = false;
        private String displayName = "";
        private bool configurationAsset;
    }
}
