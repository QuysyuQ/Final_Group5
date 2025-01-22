using BLL.Services.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.IService
{
    public interface IOrderDetailService<T, V> : IBaseService<T> where T : class where V : class
    {
        IEnumerable<T> GetAll();
        T? GetById(Guid id);
        int Add(V entityVM);
        int Remove(Guid id);
        IEnumerable<T> GetAllOrderDetailInOrderId(Guid orderId);
    }
}
