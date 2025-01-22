using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class AppRole : IdentityRole<Guid>
    {
        public const string Admin = "Administrator";
        public const string User = "User";
    }
}
