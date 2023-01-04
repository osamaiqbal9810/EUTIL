using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TekTrackingCore.Sample.Models;

namespace TekTrackingCore.Interfaces
{
    public interface IInspectionInterface
    {
        Task<List<WorkPlanDto>> GetWorkPlanDtos();
        Task<int> AddWorkPlanDto(WorkPlanDto workPlanDto);
        Task<int> DeleteWorkPlanDto(WorkPlanDto workPlanDto);
        Task<int> UpdateWorkPlanDto(WorkPlanDto workPlanDto);
    }
}
