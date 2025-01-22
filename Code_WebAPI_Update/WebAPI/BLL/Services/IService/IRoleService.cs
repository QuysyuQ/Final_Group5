using BLL.Services.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.IService
{
    public interface IRoleService<T, V> : IBaseService<T> where T : class where V : class
    {
        IEnumerable<T> GetAll();
        T? GetById(Guid id);
        int Update(Guid id, V entityVM);
        IEnumerable<T> Search(string query);
        IEnumerable<T> GetPage(int page, int pageSize);
    }
}
