using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ViewModels
{
    public class OrderVM
    {
 
        public string FullName { get; set; }
        
        public string Email { get; set; }
        
        public string PhoneNumber { get; set; }
       
        public string Address { get; set; }
    
        public string? Note { get; set; }
        public int TotalMoney { get; set; }
        public Guid UserId { get; set; }
        public Guid PayToMoneyId { get; set; }
        
    }
}
