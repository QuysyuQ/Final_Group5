using BLL.Services.IService;
using DAL.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

public class EmailService : IEmailService
{
    private readonly string _senderEmail = "quockhanhmc2509@gmail.com"; // Email của bạn
    private readonly string _senderPassword = "tpdh itxe qdqk ghxf"; // Mật khẩu hoặc mật khẩu ứng dụng
    private readonly EmailSettings emailSettings;

    public EmailService(IOptions<EmailSettings> options)
    {
        this.emailSettings = options.Value;
    }
    public async Task SendEmailOTP(MailVM mailVM, int otp, string password)
    {
        var email = new MimeMessage();
        email.Sender = MailboxAddress.Parse(emailSettings.Email);
        email.To.Add(MailboxAddress.Parse(mailVM.RecipientEmail));
        email.Subject = "Mã OTP";

        var builder = new BodyBuilder();
        builder.HtmlBody = $"<p>Xin chào, </p><p>Mã OTP của bạn là : <strong>{otp}</strong></p><p>Mật khẩu của bạn là : <strong>{password}</strong></p>.<p>Vui lòng sử dụng mã này trong vòng 5 phút.</p>";

        email.Body = builder.ToMessageBody();

        using var smptp = new SmtpClient();
        smptp.Connect(emailSettings.Host, emailSettings.Port, SecureSocketOptions.StartTls);
        smptp.Authenticate(emailSettings.Email, emailSettings.Password);
        await smptp.SendAsync(email);
        smptp.Disconnect(true);
    }
    
    public async Task SendEmailAsync(MailVM mailVM)
    {
        var email = new MimeMessage();
        email.Sender = MailboxAddress.Parse(_senderEmail);
        email.To.Add(MailboxAddress.Parse(mailVM.RecipientEmail));
        email.Subject = mailVM.Subject;

        var builder = new BodyBuilder
        {
            HtmlBody = mailVM.Body // Nội dung email có thể là HTML
        };
        email.Body = builder.ToMessageBody();

        using (var smtpClient = new SmtpClient())
        {
            // Kết nối tới máy chủ SMTP của Gmail
            await smtpClient.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);

            // Đăng nhập
            await smtpClient.AuthenticateAsync(_senderEmail, _senderPassword);

            // Gửi email
            await smtpClient.SendAsync(email);

            // Ngắt kết nối
            await smtpClient.DisconnectAsync(true);
        }
    }

    public int RandomNumber()
    {
        Random random = new Random();
        int number = random.Next(100000, 999999);
        return number;
    }
    // tạo mật khẩu ngẫu nhiên
    public string GenerateSecurePassword()
    {

        string lowerChars = "abcdefghijklmnopqrstuvwxyz";
        string upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        string digits = "0123456789";
        string specialChars = "!@#$%^&*()-_=+<>?";

        string password = "";

        password = password + GetRandomChar(lowerChars) + GetRandomChar(upperChars) + GetRandomChar(digits) + GetRandomChar(specialChars)
                        + GetRandomChar(lowerChars) + GetRandomChar(upperChars) + GetRandomChar(digits) + GetRandomChar(specialChars);

        var chars = password.ToCharArray();

        Random random = new Random();
        var shuffledChars = chars.OrderBy(c => random.Next()).ToArray();

        return new string(shuffledChars);
    }

    // Phương thức lấy một ký tự ngẫu nhiên từ chuỗi
    private char GetRandomChar(string chars)
    {
        Random random = new Random();
        int number = random.Next(0, chars.Length);
        return chars[number];
    }
}
