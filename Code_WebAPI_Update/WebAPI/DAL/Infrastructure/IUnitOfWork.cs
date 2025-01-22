using DAL.Data;
using DAL.Models;
using DAL.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Infrastructure
{
    public interface IUnitOfWork : IDisposable
    {
        ClothingAppDbContext Context { get; }
        IGenericRepository<Category> CategoryRepository { get; }
        IGenericRepository<Feedback> FeedbackRepository { get; }
        IGenericRepository<Galery> GaleryRepository { get; }
        IGenericRepository<Order> OrderRepository { get; }
        IGenericRepository<OrderDetails> OrderDetailsRepository { get; }
        IGenericRepository<PayToMoney> PayToMoneyRepository { get; }
        IGenericRepository<Product> ProductRepository { get; }


        IGenericRepository<TEntity> GenericRepository<TEntity>() where TEntity : class;
        int SaveChanges();
        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
