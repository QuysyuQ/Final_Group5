using BLL.Services.IService;
using BLL.ViewModels;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.Intrinsics.X86;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class SendEmailController : ControllerBase
{
    private readonly IEmailService _emailService;

    public SendEmailController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    // API Endpoint gửi email
    [HttpPost("send")]
    public async Task<IActionResult> SendEmail([FromBody] MailVM emailRequest)
    {
        if (emailRequest == null)
        {
            return BadRequest("Invalid email request.");
        }

        try
        {
            await _emailService.SendEmailAsync(emailRequest);
            return Ok();
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("send-otp")]
    public async Task<IActionResult> SendEmailWithOTP([FromBody] EmailForgotVM recipientEmail)
    {
        if (string.IsNullOrEmpty(recipientEmail.Email))
        {
            return BadRequest("Email recipient is required.");
        }

        try
        {
            int otp = _emailService.RandomNumber();

            var mailVM = new MailVM
            {
                RecipientEmail = recipientEmail.Email
            };

            string password = _emailService.GenerateSecurePassword();
            await _emailService.SendEmailOTP(mailVM, otp, password);

            

            var checkOTP = new Otp()
            {
                Email = recipientEmail.Email,
                OTP = otp,
                Password = password,
                SendTime = DateTime.Now,
            };

            return Ok(checkOTP);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Đã xảy ra lỗi khi gửi email.", error = ex.Message });
        }
    }

}
