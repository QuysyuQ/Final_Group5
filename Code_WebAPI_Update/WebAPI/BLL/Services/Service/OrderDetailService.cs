using BLL.Services.Base;
using BLL.Services.IService;
using BLL.ViewModels;
using DAL.Infrastructure;
using DAL.Models;
using System.Diagnostics.Metrics;
using System.Linq;

namespace BLL.Services.Service
{
    public class OrderDetailService : BaseService<OrderDetails>, IOrderDetailService<OrderDetails, OrderDetailVM>
    {
        public OrderDetailService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IEnumerable<OrderDetails> GetAll()
        {
            return base.GetAll();
        }
        public OrderDetails? GetById(Guid id)
        {
            return base.GetById(id);
        }

        public int Add(OrderDetailVM entityVM)
        {
            var orderDetail = new OrderDetails()
            {
                Id = new Guid(),
                Price =entityVM.Price,
                Num = entityVM.Num,
                Size = entityVM.Size,
                TotalMoney = entityVM.TotalMoney,
                OrderId = entityVM.OrderId,
                ProductId = entityVM.ProductId
               
            };
            return base.Add(orderDetail);
        }
        public int Remove(Guid id)
        {
            return base.Delete(id);
        }
        // Lấy ra tất cả chi tiết đơn hàng dựa trên id đơn hàng 
        public IEnumerable<OrderDetails> GetAllOrderDetailInOrderId(Guid orderId)
        {
            var orderDetails = base.GetAll().Where( x => x.OrderId == orderId);

            return orderDetails.ToList();
        }

    }
}
