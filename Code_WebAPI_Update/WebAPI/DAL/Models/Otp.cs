using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Otp
    {
        public string Email { get; set; }
        public int OTP { get; set; }
        public string Password { get; set; }
        public DateTime SendTime { get; set; }

    }
}
