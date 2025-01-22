using BLL.Services.Base;
using BLL.Services.IService;
using BLL.ViewModels;
using DAL.Infrastructure;
using DAL.Models;
using System.Security.Cryptography;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BLL.Services.Service
{
    public class CustomerService : BaseService<AppUser>, ICustomerService<AppUser, RegisterVM, AccountUser>
    {

        public CustomerService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
        // xóa người dùng theo id
        public int Remove(Guid id)
        {
            return base.Delete(id);
        }
        // tìm kiếm người dùng theo cột full name
        public IEnumerable<AppUser> Search(string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return base.GetAll();
            }
            var users = base.Search(x => x.FullName.Contains(query));

            return users;
        }
        // lấy ra danh sách người dùng theo tên người dùng , số ngày offline đơn vị là ngày có sắp xếp hay không ?
        // vidu start = 3 , end = 5 thì sẽ lấy ra những người đã off đc 3 4 5 ngày
        public IEnumerable<AppUser> Search(string query, int? start, int? end, string? sort = "asc")
        {
            IQueryable<AppUser> predicate = _unitOfWork.GenericRepository<AppUser>().GetQuery();


            if (!string.IsNullOrWhiteSpace(query))
            {
                predicate = predicate.Where(p => p.FullName.Contains(query));
            }

            if (start.HasValue)
            {
                predicate = predicate.Where(p => (DateTime.Now.Date-p.Online).Days >= start);
            }

            if (end.HasValue)
            {
                predicate = predicate.Where(p => (DateTime.Now.Date - p.Online).Days <= end);
            }

            if (sort.ToLower() == "desc")
            {
                predicate = predicate.OrderByDescending(p => p.UserName);
            }
            else
            {
                predicate = predicate.OrderBy(p => p.UserName);
            }

            return predicate.ToList();

        }
        // sửa thông tin người dùng : dành cho admin , vì liên quan tới mật khẩu phải thay đổi
        public int Update(Guid id, RegisterVM entityVM)
        {
            var aspUser =new AppUser();

            aspUser.Id = id;
            aspUser.UserName = entityVM.UserName;
            aspUser.FullName = entityVM.FullName;
            aspUser.Email = entityVM.Email;
            aspUser.Address = entityVM.Address;
            aspUser.IsActive = entityVM.IsActive;
            aspUser.NormalizedEmail = entityVM.Email.ToUpper();
            aspUser.PasswordHash = entityVM.Password;
            aspUser.PhoneNumber = entityVM.PhoneNumber;
            
            return base.Update(id, aspUser);
        }

        // Lấy ra tất cả danh sách người dùng
        public IEnumerable<AppUser> GetAll()
        {
            return base.GetAll();
        }

        // Lấy ra người dùng theo id
        public AppUser? GetById(Guid id)
        {
            return base.GetById(id);
        }

        // Lấy ra danh sách người dùng theo trang có sắp xếp đựa trên số ngày đã offline
        public IEnumerable<AppUser> GetPage(int page, int pageSize)
        {
            var users = base.GetAll().OrderBy(u => u.Online).AsQueryable();

            var usersPage = users.Skip((page - 1) * pageSize).Take(pageSize);

            return usersPage.ToList();
        }
        // Lấy thông tin người dùng thông qua email
        public AppUser? GetByEmail(string email)
        {
            var user = base.GetAll().FirstOrDefault(x => x.Email.ToLower() == email.ToLower());

            return user;
        }
        // sưa thông tin người dùng : dành cho user chỉ thay đổi thông tin ko thay đổi mật khẩu
        public int UpdateAccount(Guid id, AccountUser accountUser)
        {
            var user = base.GetAll().FirstOrDefault(u => u.Id == id);

            if(user != null)
            {
                user.FullName = accountUser.FullName;
                user.UserName = accountUser.UserName;
                user.PhoneNumber = accountUser.PhoneNumber;
                user.Address = accountUser.Address;
                user.Email = accountUser.Email;
                user.NormalizedUserName = accountUser.UserName.ToLower();
                user.NormalizedEmail = accountUser.Email.ToLower();
            }

            return base.Update(id, user);  

        }

    }
}

