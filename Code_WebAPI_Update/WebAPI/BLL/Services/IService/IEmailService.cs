using BLL.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.IService
{
    public interface IEmailService
    {
        Task SendEmailAsync(MailVM mailVM);
        Task SendEmailOTP(MailVM mailVM, int otp, string password);
        int RandomNumber();

        // mật khẩu
        string GenerateSecurePassword();
    }
}
