using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class AppUser : IdentityUser<Guid>
    {
        [Range(0, 1)]
        public int IsActive { get; set; }
        [MaxLength(500)]
        public string Address { get; set; }
        public DateTime Online { get; set; }
        public string FullName { get; set; }

    }
}
