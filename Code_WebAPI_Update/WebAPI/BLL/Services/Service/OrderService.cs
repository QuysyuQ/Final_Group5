using BLL.Services.Base;
using BLL.Services.IService;
using BLL.ViewModels;
using DAL.Infrastructure;
using DAL.Models;
using System.Diagnostics.Metrics;
using System.Security.Cryptography;

namespace BLL.Services.Service
{
    public class OrderService : BaseService<Order>, IOrderService<Order, OrderVM>
    {
        public OrderService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IEnumerable<Order> GetAll()
        {
            return base.GetAll();
        }

        public Order? GetById(Guid id)
        {
            return base.GetById(id);
        }
        public Guid? Add(OrderVM entityVM)
        {
            var order = new Order()
            {
                Id = new Guid(),
                FullName = entityVM.FullName,
                Email = entityVM.Email,
                PhoneNumber = entityVM.PhoneNumber,
                Address = entityVM.Address,
                Note = entityVM.Note,
                OrderDate = DateTime.Now,
                status = 0,
                TotalMoney = entityVM.TotalMoney,
                UserId = entityVM.UserId,
                PayToMoneyId = entityVM.PayToMoneyId
            };

            var result = base.Add(order);
            if(result != 0 )
            {
                return order.Id;
            }
            return null;
        }

        public int Remove(Guid id)
        {
            return base.Delete(id);
        }

        public int Update(Guid id, OrderVM entityVM)
        {
            var order = new Order()
            {
                Id = id,
                FullName = entityVM.FullName,
                Email = entityVM.Email,
                PhoneNumber = entityVM.PhoneNumber,
                Address = entityVM.Address,
                Note = entityVM.Note,
                OrderDate = base.GetById(id).OrderDate,
                status = 0,
                TotalMoney = entityVM.TotalMoney,
                UserId = entityVM.UserId,
                PayToMoneyId = entityVM.PayToMoneyId

            };
            return base.Update(id, order);
        }
        // tìm kiếm đơn hàng theo tên khách hàng và khoảng giá trị đơn hàng , có sắp xếp
        public IEnumerable<Order> Search(string query, int? start, int? end, string? sort )
        {
            IQueryable<Order> predicate = _unitOfWork.GenericRepository<Order>().GetQuery();

            if (!string.IsNullOrWhiteSpace(query))
            {
                predicate = predicate.Where(p => p.FullName.Contains(query));
            }

            if (start.HasValue)
            {
                predicate = predicate.Where(p => p.TotalMoney >= start);
            }

            if (end.HasValue)
            {
                predicate = predicate.Where(p => p.TotalMoney <= end);
            }

            if (sort.ToLower() == "desc")
            {
                predicate = predicate.OrderByDescending(p => p.FullName);
            }
            else
            {
                predicate = predicate.OrderBy(p => p.FullName);
            }

            return predicate.ToList();
        }
        // lấy ra thông tin các đơn hàng theo trang có sắp xếp theo ngày đặt
        public IEnumerable<Order> GetPage(int page, int pageSize)
        {
            var orders = base.GetAll().OrderByDescending(p => p.OrderDate).AsQueryable();

            var ordersPage = orders.Skip((page-1)*pageSize).Take(pageSize).ToList();

            return ordersPage;

        }
        // Lấy ra tất cả đơn hàng đựa trên id khách hàng
        public IEnumerable<Order> GetAllOrderUserId(Guid userId)
        {
            var orders = base.GetAll().Where(o => o.UserId == userId).OrderByDescending(o => o.OrderDate);

            return orders.ToList();
        }
        // thay đổi trạng thái của đơn hàng
        public int UpdateStatusOrder(Guid orderId)
        {
            var order = base.GetAll().FirstOrDefault(o => o.Id == orderId);
            if (order != null) 
            {
                if(order.status < 3)
                {
                    order.status = order.status + 1;
                }
            }
            else
            {
                return 0;
            }
            _unitOfWork.GenericRepository<Order>().Update(order);
            var result = _unitOfWork.SaveChanges();

            return result;
        }
    }
}
