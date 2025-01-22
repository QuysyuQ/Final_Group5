using BLL.Services.Base;
using System.Security.Cryptography;

namespace BLL.Services.IService
{
    public interface ICustomerService<T, V , A> : IBaseService<T> where T : class where V : class where A : class
    {
        IEnumerable<T> GetAll();
        T? GetById(Guid id);
        int Update(Guid id, V entityVM);
        int Remove(Guid id);
        IEnumerable<T> Search(string query);
        IEnumerable<T> Search(string query, int? start, int? end, string? sort = "asc");
        IEnumerable<T> GetPage(int page, int pageSize);
        T? GetByEmail(string email);
        int UpdateAccount(Guid id, A entityVM);



    }
}
