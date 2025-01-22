using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Order
    {
        public Guid Id { get; set; }

        public string FullName { get; set; }

        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public string Address { get; set; }

        public string? Note { get; set; }
        public DateTime OrderDate { get; set; }
        public int status { get; set; }
        public int TotalMoney { get; set; }
        [ForeignKey("UserId")]
        public Guid UserId { get; set; }
        public AppUser User { get; set; }

        public Guid PayToMoneyId { get; set; }
        public PayToMoney PayToMoney { get; set; }
    }
}
