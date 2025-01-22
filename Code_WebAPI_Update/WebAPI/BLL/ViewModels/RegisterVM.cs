using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ViewModels
{
    public class RegisterVM
    {
        [Required(ErrorMessage = "User is required !")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Full name is required !")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "Email is required !")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Password is required !")]
        public string Password { get; set; }
        [Required(ErrorMessage = "Phone number is required !")]
        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = "Address is required !")]
        public string Address { get; set; }
        [Required(ErrorMessage = "Active is required !")]
        public int IsActive { get; set; }
    }
}
