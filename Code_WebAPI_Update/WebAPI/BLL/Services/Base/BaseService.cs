using DAL.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Base
{
    public class BaseService<T> : IBaseService<T> where T : class
    {
        protected readonly IUnitOfWork _unitOfWork;
        public BaseService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public virtual int Add(T entity)
        {
            if (entity == null) throw new ArgumentNullException(nameof(entity));

            _unitOfWork.GenericRepository<T>().Add(entity);
            return _unitOfWork.SaveChanges();
        }

        public async virtual Task<int> AddAsync(T entity)
        {
            if (entity == null) throw new ArgumentNullException(nameof(entity));

            _unitOfWork.GenericRepository<T>().Add(entity);
            return await _unitOfWork.SaveChangesAsync();
        }

        public virtual int Delete(Guid id)
        {
            var entity = _unitOfWork.GenericRepository<T>().GetById(id);
            if (entity != null)
            {
                _unitOfWork.GenericRepository<T>().Delete(entity);
                return _unitOfWork.SaveChanges();
            }

            throw new ArgumentNullException(nameof(entity));
        }

        public async virtual Task<int> DeleteAsync(Guid id)
        {
            var entity = _unitOfWork.GenericRepository<T>().GetById(id);
            if (entity != null)
            {
                _unitOfWork.GenericRepository<T>().Delete(entity);
                return await _unitOfWork.SaveChangesAsync();
            }

            throw new ArgumentNullException(nameof(entity));
        }

        public virtual IEnumerable<T> GetAll()
        {
            return _unitOfWork.GenericRepository<T>().GetAll();
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _unitOfWork.GenericRepository<T>().GetAllAsync();
        }

        public virtual T? GetById(Guid id)
        {
            return _unitOfWork.GenericRepository<T>().GetById(id);
        }

        public virtual async Task<T?> GetByIdAsync(Guid id)
        {
            return await _unitOfWork.GenericRepository<T?>().GetByIdAsync(id);
        }

        public virtual int Update(Guid id, T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            var search = GetById(id);

            if (search == null)
            {
                throw new ArgumentNullException($"search can not by id {id}");
            }

            _unitOfWork.Context.Entry(search).CurrentValues.SetValues(entity);

            _unitOfWork.GenericRepository<T>().Update(search);
            return _unitOfWork.SaveChanges();
        }


        public virtual async Task<int> UpdateAsync(Guid id, T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            var search = GetById(id);

            if (search == null)
            {
                throw new ArgumentNullException($"search can not by id {id}");
            }

            _unitOfWork.Context.Entry(search).CurrentValues.SetValues(entity);

            _unitOfWork.GenericRepository<T>().Update(search);

            return await _unitOfWork.SaveChangesAsync();
        }

        public virtual IEnumerable<T> Search(Expression<Func<T, bool>> predicate)
        {
            return _unitOfWork.GenericRepository<T>().GetQuery(predicate).ToList();
        }

        public virtual IEnumerable<T> Search(
            Expression<Func<T, bool>> predicate,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            bool? ascending = true)
        {
            var query = _unitOfWork.GenericRepository<T>().GetQuery();

            if (query != null)
            {
                query = query.Where(predicate);
            }

            if (orderBy != null)
            {
                query = ascending.HasValue && ascending.Value ? orderBy(query) : orderBy(query).Reverse();
            }

            return query.ToList();
        }

        public virtual IEnumerable<T> GetPage(int page, int pageSize)
        {
            return _unitOfWork.GenericRepository<T>().GetPage(page, pageSize);
        }
    }
}
