using BLL.Services.IService;
using BLL.Services.Service;
using BLL.ViewModels;
using DAL.Data;
using DAL.Infrastructure;
using DAL.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ClothingAppDbContext>(options => options.UseSqlServer(connectionString));

// Email
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddScoped<ICategoryService<Category, CategoryVM>, CategoryService>();
builder.Services.AddScoped<IPayToMoneyService<PayToMoney, PayToMoneyVM>, PayToMoneyService>();
builder.Services.AddScoped<IProductService<Product, ProductVM>, ProductService>();
builder.Services.AddScoped<IFeedbackService<Feedback, FeedbackVM>, FeedbackService>();
builder.Services.AddScoped<IOrderService<Order, OrderVM>, OrderService>();
builder.Services.AddScoped<ICustomerService<AppUser, RegisterVM, AccountUser>, CustomerService>();
builder.Services.AddScoped<IRoleService<AppRole, RoleVM>, RoleService>();
builder.Services.AddScoped<ICartService<Cart, CartVM>, CartService>();
builder.Services.AddScoped<IOrderDetailService<OrderDetails, OrderDetailVM>, OrderDetailService>();
//builder.Services.AddScoped<EmailService>();

builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddIdentity<AppUser, AppRole>()
                .AddEntityFrameworkStores<ClothingAppDbContext>()
                .AddDefaultTokenProviders();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{

    c.SwaggerDoc("v1", new OpenApiInfo { Title = "MyAPI", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
        Name = "Authorization",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {{
                          new OpenApiSecurityScheme
                          {
                              Reference = new OpenApiReference
                              {
                                  Type = ReferenceType.SecurityScheme,
                                  Id = "Bearer"
                              }
                          },
                         new string[] {}
                    }
    });
});

//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;

//    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
//})
//.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
//.AddGoogle(googleOptions =>
//    {
//        var googleAuthNSection = builder.Configuration.GetSection("Authentication:Google");

//        googleOptions.ClientId = googleAuthNSection["ClientId"];
//        googleOptions.ClientSecret = googleAuthNSection["ClientSecret"];
//    })

builder.Services.AddAuthentication(config =>
{
    config.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    config.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    config.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
 .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding
                .ASCII
                .GetBytes(builder.Configuration["JWT:Secret"]
                .ToString())),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["JWT:Audience"],
        };
    });

var app = builder.Build();


app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Images")),
    RequestPath = "/Images"
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();




app.UseCors(opttion =>
{
    opttion.AllowAnyHeader();
    opttion.AllowAnyMethod();
    opttion.AllowAnyOrigin();
}
);




app.UseAuthorization();

app.MapControllers();

app.Run();
