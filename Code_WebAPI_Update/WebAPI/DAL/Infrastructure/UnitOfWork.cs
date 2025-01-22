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
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ClothingAppDbContext _context;
        
        private IGenericRepository<Category> _categoryRepository { get; }
        private IGenericRepository<Feedback> _feedbackRepository { get; }
        private IGenericRepository<Galery> _galeryRepository { get; }
        private IGenericRepository<Order> _orderRepository { get; }
        private IGenericRepository<OrderDetails> _orderDetailsRepository { get; }
        private IGenericRepository<PayToMoney> _payToMoneyRepository { get; }
        private IGenericRepository<Product> _productRepository { get; }


        public ClothingAppDbContext Context => _context;
      
        public IGenericRepository<Category> CategoryRepository => _categoryRepository;
        public IGenericRepository<Feedback> FeedbackRepository => _feedbackRepository;
        public IGenericRepository<Galery> GaleryRepository => _galeryRepository;
        public IGenericRepository<Order> OrderRepository => _orderRepository;
        public IGenericRepository<OrderDetails> OrderDetailsRepository => _orderDetailsRepository;
        public IGenericRepository<PayToMoney> PayToMoneyRepository => _payToMoneyRepository;
        public IGenericRepository<Product> ProductRepository => _productRepository;
        public UnitOfWork(ClothingAppDbContext context)
        {
            _context = context;
        }

        public IGenericRepository<TEntity> GenericRepository<TEntity>() where TEntity : class
        {
            return new GenericRepository<TEntity>(_context);
        }

        public int SaveChanges()
        {
            return _context.SaveChanges();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            await _context.Database.CommitTransactionAsync();
        }

        public async Task RollbackTransactionAsync()
        {
            await _context.Database.RollbackTransactionAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
