using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ViewModels
{
    public class LoginVM
    {
        [Required(ErrorMessage = "email is requied ")]
        public string Email { get; set; }
        [Required(ErrorMessage = "password is requied ")]
        public string Password { get; set; }
    }
}
