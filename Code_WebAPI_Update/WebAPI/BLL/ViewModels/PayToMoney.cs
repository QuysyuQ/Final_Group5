using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ViewModels
{
    public class PayToMoneyVM
    {
        public string NamePay { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        [Range(0, 1)]
        public int IsActive { get; set; }
    }
}
