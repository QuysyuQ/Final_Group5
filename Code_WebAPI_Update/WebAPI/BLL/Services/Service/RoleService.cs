using BLL.Services.Base;
using BLL.Services.IService;
using BLL.ViewModels;
using DAL.Infrastructure;
using DAL.Models;
using Microsoft.AspNetCore.Identity.UI.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Service
{
    public class RoleService : BaseService<AppRole>, IRoleService<AppRole, RoleVM>
    {
        public RoleService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IEnumerable<AppRole> GetAll()
        {
            return base.GetAll();
        }
        public IEnumerable<AppRole> Search(string query)
        {
            if(query == null)
            {
                return null;
            }

            return base.Search(r => r.Name.Contains(query));
        }


        public int Update(Guid id, RoleVM entityVM)
        {
            var role = new AppRole()
            {
                Id = id,
                Name = entityVM.Name,
                NormalizedName = entityVM.Name.ToUpper(),
                ConcurrencyStamp = null
            };
            return base.Update(id, role);
        }
    }
}
