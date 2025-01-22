using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ViewModels
{
    public class AuthResultVM
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public IList<string> Role { get; set; }
        public int IsActive { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
