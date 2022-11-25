using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore.Framework.Types
{
    public class DefectCode
    {

        private String code = "";
        private String title = "";
        private List<DefectCode> details;
        private List<DefectCode> filterDetails;
        private String filterText = "";
    }
}
