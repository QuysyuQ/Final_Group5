using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Base
{
    public interface IBaseService<T> where T : class
    {
        int Add(T entity);
        int Update(Guid id, T entity);
        int Delete(Guid id);
        Task<int> AddAsync(T entity);
        Task<int> UpdateAsync(Guid id, T entity);
        Task<int> DeleteAsync(Guid id);
        IEnumerable<T> GetAll();
        Task<IEnumerable<T>> GetAllAsync();
        T? GetById(Guid id);
        Task<T?> GetByIdAsync(Guid id);
        IEnumerable<T> Search(Expression<Func<T, bool>> predicate);
        IEnumerable<T> Search(
            Expression<Func<T, bool>> predicate,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            bool? ascending = true);
        IEnumerable<T> GetPage(int page, int pageSize);

        
    }
}
