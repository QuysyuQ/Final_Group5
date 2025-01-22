using BLL.Services.Base;
using BLL.Services.IService;
using BLL.ViewModels;
using DAL.Infrastructure;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Service
{
    public class PayToMoneyService : BaseService<PayToMoney>, IPayToMoneyService<PayToMoney, PayToMoneyVM>
    {
        public PayToMoneyService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IEnumerable<PayToMoney> GetAll()
        {
            return base.GetAll();
        }
        public PayToMoney? GetById(Guid id)
        {
            return base.GetById(id);
        }
        public int Add(PayToMoneyVM entityVM)
        {
            var payToMoney = new PayToMoney()
            {
                Id = new Guid(),
                NamePay = entityVM.NamePay,
                Type = entityVM.Type,
                Description = entityVM.Description,
                IsActive = entityVM.IsActive,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
            };
            return base.Add(payToMoney);
        }

        public int Remove(Guid id)
        {
            return base.Delete(id);
        }

        public int Update(Guid id, PayToMoneyVM entityVM)
        {
            var payToMoney = new PayToMoney()
            {
                Id = id,
                NamePay = entityVM.NamePay,
                Type = entityVM.Type,
                Description = entityVM.Description,
                IsActive = entityVM.IsActive,
                CreatedAt = base.GetById(id).CreatedAt,
                UpdatedAt = DateTime.Now,
            };
            return base.Update(id, payToMoney);
        }

        public IEnumerable<PayToMoney> Search(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return base.GetAll();
            }
            return base.Search(x => x.NamePay.Contains(query));
        }

        public IEnumerable<PayToMoney> GetPage(int page, int pageSize)
        {
            return base.GetPage(page, pageSize);
        }
    }
}
