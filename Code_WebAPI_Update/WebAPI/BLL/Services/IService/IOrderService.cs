using BLL.Services.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.IService
{
    public interface IOrderService<T, V> : IBaseService<T> where T : class where V : class
    {
        IEnumerable<T> GetAll();
        T? GetById(Guid id);
        Guid? Add(V entityVM);
        int Update(Guid id, V entityVM);
        int Remove(Guid id);
        IEnumerable<T> Search(string query, int? start, int? end, string? sort = "asc");
        IEnumerable<T> GetPage(int page, int pageSize);

        IEnumerable<T> GetAllOrderUserId(Guid userId);
        int UpdateStatusOrder(Guid orderId);
    }
}
