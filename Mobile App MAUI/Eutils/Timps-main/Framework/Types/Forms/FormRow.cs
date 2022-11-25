using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TekTrackingCore.Framework.Types.Forms
{
    public class FormRow
    {
        private FormField field;
        private List<FormField> cols;

        public FormField getField()
        {
            return field;
        }

        public void setField(FormField field)
        {
            this.field = field;
        }

        public void setCols(List<FormField> cols)
        {
            this.cols = cols;
        }

        public List<FormField> getCols()
        {
            return cols;
        }
    }
}
