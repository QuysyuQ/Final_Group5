using BLL.Services.Base;
using BLL.Services.IService;
using BLL.ViewModels;
using DAL.Infrastructure;
using DAL.Models;

namespace BLL.Services.Service
{
    public class FeedbackService : BaseService<Feedback>, IFeedbackService<Feedback, FeedbackVM>
    {
        public FeedbackService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        // lấy tất cả đánh giá
        public IEnumerable<Feedback> GetAll()
        {
            return base.GetAll();
        }
        // lấy đánh giá theo id
        public Feedback? GetById(Guid id)
        {
            return base.GetById(id);
        }
        // Thêm 
        public int Add(FeedbackVM entityVM)
        {
            var feedback = new Feedback()
            {
                Id = new Guid(),
                Vote = entityVM.Vote,
                Comment = entityVM.Comment,
                ProductId = entityVM.ProductId,
            };

            return base.Add(feedback);
        }
        // xóa 
        public int Remove(Guid id)
        {
            return base.Delete(id);
        }
        // sửa
        public int Update(Guid id, FeedbackVM entityVM)
        {
            var feedback = new Feedback()
            {
                Id = id,
                Vote = entityVM.Vote,
                Comment = entityVM.Comment,
                ProductId = entityVM.ProductId,
            };

            return base.Update(id, feedback);
        }
        // tìm kiếm
        public IEnumerable<Feedback> Search(string query)
        {
            if (!string.IsNullOrWhiteSpace(query))
            {
                return base.Search(x => x.Comment.Contains(query));
            }
            return base.GetAll();
        }
        //lấy phân trang
        public IEnumerable<Feedback> GetPage(int page, int pageSize)
        {
            return base.GetPage(page, pageSize);
        }

        // Lấy tất cả đánh giá theo ProductId
        public IEnumerable<Feedback> GetByReviewProductId(Guid productId)
        {
            return base.GetAll().Where(f => f.ProductId == productId);
        }
    }
}
