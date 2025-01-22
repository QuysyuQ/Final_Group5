using BLL.Services.Base;
using BLL.Services.IService;
using BLL.ViewModels;
using DAL.Infrastructure;
using DAL.Models;

namespace BLL.Services.Service
{
    public class CategoryService : BaseService<Category>, ICategoryService<Category, CategoryVM>
    {
        public CategoryService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
        // lấy ra tất cả danh mục
        public IEnumerable<Category> GetAll()
        {
            return base.GetAll();
        }
        // tìm kiếm danh mục theo tên
        public IEnumerable<Category> Search(string name)
        {

            if (string.IsNullOrEmpty(name))
            {
                return base.GetAll();
            }
            return base.Search(x => x.Name.Contains(name));
        }


        // lấy danh mục theo id
        public Category? GetById(Guid id)
        {
            return base.GetById(id);
        }
        // thêm một danh mục mới
        public int Add(CategoryVM entityVM)
        {
            var category = new Category()
            {
                Id = new Guid(),
                Name = entityVM.Name,
            };

            return base.Add(category);


        }
        // sửa thông tin danh mục
        public int Update(Guid id, CategoryVM entityVM)
        {
            var category = new Category()
            {
                Id = id,
                Name = entityVM.Name,
            };
            return base.Update(id, category);
        }
        public int Remove(Guid id)
        {
            return base.Delete(id);
        }
        //Lấy theo phân trang
        public IEnumerable<Category> GetPage(int page, int pageSize)
        {
            return base.GetPage(page, pageSize);
        }
    }
}
