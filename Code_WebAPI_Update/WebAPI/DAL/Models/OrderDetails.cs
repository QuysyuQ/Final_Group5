using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class OrderDetails
    {
        public Guid Id { get; set; }
        public int Price { get; set; }
        public int Num { get; set; }
        public string Size { get; set; }
        public int TotalMoney { get; set; }


        [ForeignKey("OrderId")]
        public Guid OrderId { get; set; }
        public Order order { get; set; }
        [ForeignKey("ProducId")]
        public Guid ProductId { get; set; }
        public Product Product { get; set; }
    }
}
