using DAL.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ViewModels
{
    public class OrderDetailVM
    {
        public int Price { get; set; }
        public int Num { get; set; }
        public string Size { get; set; }
        public int TotalMoney { get; set; }

        public Guid OrderId { get; set; }
        public Guid ProductId { get; set; }
    }
}
