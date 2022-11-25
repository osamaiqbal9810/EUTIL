using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Framework.Types.Forms;

namespace TekTrackingCore.Framework.Types
{
    public class Form
    {
        private String name = "";
        private List<FormRow> rows;

        public String getName()
        {
            return name;
        }

        public void setName(String name)
        {
            this.name = name;
        }

        public List<FormRow> getRows()
        {
            return rows;
        }

        public void setRows(List<FormRow> rows)
        {
            this.rows = rows;
        }

    }
}
