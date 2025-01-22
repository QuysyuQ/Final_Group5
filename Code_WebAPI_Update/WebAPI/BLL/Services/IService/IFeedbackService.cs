using BLL.Services.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.IService
{
    public interface IFeedbackService<T, V> : IBaseService<T> where T : class where V : class
    {
        IEnumerable<T> GetAll();
        T? GetById(Guid id);
        int Add(V entityVM);
        int Update(Guid id, V entityVM);
        int Remove(Guid id);
        IEnumerable<T> Search(string query);
        IEnumerable<T> GetPage(int page, int pageSize);

        IEnumerable<T> GetByReviewProductId(Guid productId);
    }
}
