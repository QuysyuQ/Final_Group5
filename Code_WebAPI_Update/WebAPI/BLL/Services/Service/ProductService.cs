using BLL.Services.Base;
using BLL.Services.IService;
using BLL.ViewModels;
using DAL.Infrastructure;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace BLL.Services.Service
{
    public class ProductService : BaseService<Product>, IProductService<Product, ProductVM>
    {
        public ProductService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
        // lấy ra tất cả sản phẩm
        public IEnumerable<Product> GetAll()
        {
            return base.GetAll().OrderByDescending(p => p.CreatedAt);
        }

        public Product? GetById(Guid id)
        {
            return base.GetById(id);
        }

        public int Add(ProductVM entityVM)
        {
            var product = new Product()
            {
                Id = new Guid(),
                Title = entityVM.Title,
                Price = entityVM.Price,
                Discount = entityVM.Discount,
                Thumbnail = entityVM.Thumbnail,
                Description = entityVM.Description,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                Quantity = entityVM.Quantity,
                CategoryId = entityVM.CategoryId,
                size = entityVM.size,
                Preserve = entityVM.Preserve
            };

            return base.Add(product);

        }

        public int Remove(Guid id)
        {
            return base.Delete(id);
        }

        public int Update(Guid id, ProductVM entityVM)
        {
            var product = new Product()
            {
                Id = id,
                Title = entityVM.Title,
                Price = entityVM.Price,
                Discount = entityVM.Discount,
                Thumbnail = entityVM.Thumbnail,
                Description = entityVM.Description,
                CreatedAt = base.GetById(id).CreatedAt,
                UpdatedAt = DateTime.Now,
                Quantity = entityVM.Quantity,
                CategoryId = entityVM.CategoryId,
                size=entityVM.size,
                Preserve=entityVM.Preserve
            };

            return base.Update(id, product);
        }
        // lấy ra tất cả sản phẩm theo tên sản phẩm, khoảng lấy dựa trên giá bán chưa giảm giá có sắp xếp
        public IEnumerable<Product> Search(string query, int? start, int? end, string? sort)
        {
            IQueryable<Product> predicate = _unitOfWork.GenericRepository<Product>().GetQuery();

            if (!string.IsNullOrWhiteSpace(query))
            {
                predicate = predicate.Where(p => p.Title.Contains(query));
            }

            if (start.HasValue)
            {
                predicate = predicate.Where(p => p.Price >= start);
            }

            if (end.HasValue)
            {
                predicate = predicate.Where(p => p.Price <= end);
            }

            if (sort.ToLower() == "desc")
            {
                predicate = predicate.OrderByDescending(p => p.Title);
            }
            else
            {
                predicate = predicate.OrderBy(p => p.Title);
            }

            predicate = predicate.Skip(0).Take(8);

            return predicate.ToList();
        }

        public IEnumerable<Product> GetPage(int page, int pageSize)
        {
            var products = base.GetAll().OrderByDescending(p => p.CreatedAt).AsQueryable();

            var productsPage = products.Skip((page - 1) * pageSize).Take(pageSize);


            return productsPage.ToList();
        }
        // Lấy ra tất cả sản phẩm theo danh mục sản phẩm 
        public IEnumerable<Product> GetProductInCategory(Guid categoryId, int? page, int? pageSize, string? sort)
        {
            var query = base.GetAll().AsQueryable();

            query = query.Where(p => p.CategoryId == categoryId);

            if (!string.IsNullOrWhiteSpace(sort))
            {
                if (sort.ToLower() == "asc")
                {
                    query = query.OrderBy(p => p.Price);
                }
                else if (sort.ToLower() == "desc")
                {
                    query = query.OrderByDescending(p => p.Price);
                }
            }

            if (pageSize.HasValue && page.HasValue)
            {
                query = query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value);
            }

            return query.ToList();
        }
        // Lấy ra các sản phẩm trong cùng danh mục có giá sấp sỉ ngang nhau
        public IEnumerable<Product> GetProductInCategoryEqualPrice(Guid categoryId, int? priceStart, int? priceEnd, int? page, int? pageSize)
        {
            var query = base.GetAll().AsQueryable();


            query = query.Where(p => p.CategoryId == categoryId);

            if (priceStart.HasValue)
            {
                query = query.Where(p => p.Price > priceStart.Value);
            }

            if (priceEnd.HasValue)
            {
                query = query.Where(p => p.Price < priceEnd.Value);
            }

            if (page.HasValue && pageSize.HasValue)
            {
                query = query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value);
            }

            return query.ToList() ;
        }

        public int UpdateQuantity(Guid id, int quantity)
        {
            var product = base.GetById(id);
            if (product != null) 
            {
                product.Quantity = product.Quantity - quantity;
            }

            return base.Update(id, product);
        }
    }
}
