using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ViewModels
{
    public class CartVM
    {
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
        //public string thumbnail { get; set; }
        public string size { get; set; }
        public int Quantity { get; set; }
        public int Price { get; set; }
    }
}
