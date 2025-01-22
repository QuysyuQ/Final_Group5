using BLL.Services.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.IService
{
    public interface IProductService<T, V> : IBaseService<T> where T : class where V : class
    {
        IEnumerable<T> GetAll();
        T? GetById(Guid id);
        int Add(V entityVM);
        int Update(Guid id, V entityVM);
        int UpdateQuantity(Guid id , int quantity);
        int Remove(Guid id);
        //IEnumerable<T> Search(string query);
        IEnumerable<T> Search(string query, int? start, int? end, string? sort = "asc");
        IEnumerable<T> GetPage(int page, int pageSize);
        IEnumerable<T> GetProductInCategory(Guid categoryId, int? page, int? pageSize,string? sort);
        IEnumerable<T> GetProductInCategoryEqualPrice(Guid categoryId, int? priceStart, int? priceEnd, int? page, int? pageSize);
    }
}
