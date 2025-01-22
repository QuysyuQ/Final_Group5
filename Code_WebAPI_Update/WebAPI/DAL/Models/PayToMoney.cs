using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class PayToMoney
    {
        public Guid Id { get; set; }
        public string NamePay { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }

        [Range(0, 1)]
        public int IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}