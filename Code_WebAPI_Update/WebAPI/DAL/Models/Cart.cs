using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Cart
    {

        public Guid ProductId { get; set; }
        public Guid UserId { get; set; }
        public string Size { get; set; }
        public int Quantity { get; set; }
        public int Price { get; set; }

        [ForeignKey("UserId")]
        public AppUser User { get; set; }
    }
}
