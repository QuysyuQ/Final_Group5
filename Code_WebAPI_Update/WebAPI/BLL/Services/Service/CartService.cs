using BLL.Services.Base;
using BLL.Services.IService;
using BLL.ViewModels;
using DAL.Infrastructure;
using DAL.Models;
using Microsoft.SqlServer.Server;
using System.Linq;

namespace BLL.Services.Service
{
    public class CartService : BaseService<Cart>, ICartService<Cart, CartVM>
    {
        public CartService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
        // lấy ra tất cả sản phẩm trong giỏ hàng
        public IEnumerable<Cart> GetAll()
        {
            return base.GetAll();
        }
        // thêm sản phẩm vào trong giỏ hàng
        public int Add(CartVM entityVM)
        {
            var cart = new Cart(){ 
                UserId = entityVM.UserId,
                ProductId = entityVM.ProductId,
                Size = entityVM.size,
                Price = entityVM.Price,
                Quantity = entityVM.Quantity,
            };
            return base.Add(cart);
        }
        // Lấy sản phẩm theo id của người dùng
        public IEnumerable<Cart> GetById(Guid userId)
        {
            var carts = base.GetAll().Where(c => c.UserId == userId);
            return carts.ToList();
        }
        // sửa số lượng sản phẩm trong giỏ hàng theo id người dùng và id sản phẩm 
        public int Update(Guid userId, Guid productId, int entityVM)
        {
            var cart = base.GetAll().FirstOrDefault(c => c.UserId == userId && c.ProductId == productId);

            if(cart != null)
            {
                cart.Quantity = entityVM;
            }

            _unitOfWork.GenericRepository<Cart>().Update(cart);
            var result = _unitOfWork.SaveChanges();

            return result;
        }

        // xóa sản phẩm trong giỏ theo id người dùng và id sản phẩm
        public int Delete(Guid userId, Guid productId)
        {
            var cart = base.GetAll().FirstOrDefault(c => c.UserId == userId && c.ProductId == productId);

            if (cart != null)
            {
                _unitOfWork.GenericRepository<Cart>().Delete(cart);
                var result = _unitOfWork.SaveChanges();

                return result;
            }

            return 0;
        }
        // xóa tất cả sản phẩm trong giỏ theo id người dùng
        public int Delete(Guid userId)
        {
            var count = 0;

            var carts = base.GetAll().Where(c => c.UserId == userId).ToList();

            var lengthCarts = carts.Count();

            foreach (var cart in carts)
            {
                _unitOfWork.GenericRepository<Cart>().Delete(cart);
                var result = _unitOfWork.SaveChanges();

                if(result != 0 )
                {
                    count++;
                }
            }

            if(count == lengthCarts)
            {
                return 1;
            }
            else
            {
                return 0;

            }
        }
    }
}
