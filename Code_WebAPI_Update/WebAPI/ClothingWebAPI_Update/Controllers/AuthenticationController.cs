using BLL.Services.IService;
using BLL.ViewModels;
using DAL.Data;
using DAL.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ClothingWebAPI_Update.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ICustomerService<AppUser, RegisterVM, AccountUser> _customerService;
        private readonly ClothingAppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<AppRole> _roleManager;

        public AuthenticationController(UserManager<AppUser> userManager,
            RoleManager<AppRole> roleManager,
            ClothingAppDbContext context,
            IConfiguration configuration,
            ICustomerService<AppUser, RegisterVM, AccountUser> customerService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _configuration = configuration;
            _customerService = customerService;
        }

        
        [HttpPost("register-user")]
        public async Task<IActionResult> Register([FromBody] RegisterVM registerVM)
        {
            var userExists = await _userManager.FindByEmailAsync(registerVM.Email);
            if (userExists != null)
            {
                return BadRequest($"User {registerVM.Email} already exists");
            }

            var newUser = new AppUser()
            {
                UserName = registerVM.UserName,
                FullName = registerVM.FullName,
                Email = registerVM.Email,
                IsActive = registerVM.IsActive,
                Address = registerVM.Address,
                PhoneNumber = registerVM.PhoneNumber,
                Online = DateTime.Now.Date,
                SecurityStamp = new Guid().ToString()
            };

            var result = await _userManager.CreateAsync(newUser, registerVM.Password);

            if (result.Succeeded)
            {

                var adminUsers = await _userManager.GetUsersInRoleAsync(AppRole.Admin);

                if (adminUsers.Count == 0)
                {
                    if (!await _roleManager.RoleExistsAsync(AppRole.Admin))
                    {
                        await _roleManager.CreateAsync(new AppRole { Name = AppRole.Admin});
                    }
                    await _userManager.AddToRoleAsync(newUser, AppRole.Admin);
                }
                else
                {
                    if (!await _roleManager.RoleExistsAsync(AppRole.User))
                    {
                        await _roleManager.CreateAsync(new AppRole { Name = AppRole.User});
                    }
                    await _userManager.AddToRoleAsync(newUser, AppRole.User);
                }

                return Ok();
            }
            return BadRequest("User could not be created");
        }


        [HttpPost("login-user")]
        public async Task<IActionResult> Login([FromBody] LoginVM payload)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please, provide all required fields");
            }

            var user = await _userManager.FindByEmailAsync(payload.Email);

            if (user != null && user.IsActive == 0)
            {
                return BadRequest("User can not login ! ");
            }

            if (user != null && await _userManager.CheckPasswordAsync(user, payload.Password))
            {
                user.Online = DateTime.Now.Date;
                var result = await _userManager.UpdateAsync(user);
                _context.SaveChanges();

                var authClaims = new List<Claim>()
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                var userRole = await _userManager.GetRolesAsync(user);
                foreach (var role in userRole)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role));
                }

                var tokenValue = await GenerateJwtToken(user, authClaims, userRole);



                return Ok(tokenValue);
            }

            return Unauthorized();
        }
        private async Task<AuthResultVM> GenerateJwtToken(AppUser user, List<Claim> authClaims, IList<string> RoleName)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                expires: DateTime.UtcNow.AddMinutes(10),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)


            );

            var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

            var refreshToken = new RefreshToken()
            {
                JwtId = token.Id,
                IsRevoked = false,
                UserId = user.Id,
                DateAdded = DateTime.UtcNow,
                DateExpire = DateTime.UtcNow.AddMonths(6),
                Token = Guid.NewGuid().ToString() + "-" + Guid.NewGuid().ToString()
            };

            await _context.RefreshTokens.AddAsync(refreshToken);
            await _context.SaveChangesAsync();

            var response = new AuthResultVM()
            {
                Token = jwtToken,
                RefreshToken = refreshToken.Token,
                ExpiresAt = token.ValidTo,
                IsActive = user.IsActive,
                Role = RoleName,
            };



            return response;
        }
       
        [HttpGet("get-all-user")]
        public IActionResult GetAllUser()
        {
            return Ok(_customerService.GetAll());
        }
       
        [HttpGet("get-user-by-id/{id}")]
        public IActionResult GetUserById(Guid id)
        {
            return Ok(_customerService.GetById(id));
        }
       
        [HttpGet("search-user-name")]
        public IActionResult GetUserName(string fullName)
        {
            return Ok(_customerService.Search(fullName));
        }
       
        [HttpGet("get-user-page")]
        public IActionResult GetPageUser(int page = 1, int pageSize = 5)
        {
            if (page <= 0)
            {
                page = 1;
            }
            if (pageSize <= 0)
            {
                pageSize = 5;
            }

            return Ok(_customerService.GetPage(page, pageSize));
        }

        // update người dùng có mã hóa mật khẩu
        [HttpPut("update-user-by-id/{id}")]
        public IActionResult UpdateUserById(Guid id, [FromBody] RegisterVM registerVM)
        {
            var user = _customerService.GetById(id);

            if (user != null) 
            {
                user.UserName = registerVM.UserName;
                user.FullName = registerVM.FullName;
                user.Address = registerVM.Address;
                user.PhoneNumber = registerVM.PhoneNumber;
                user.Email = registerVM.Email;
                user.IsActive = registerVM.IsActive;
                user.NormalizedEmail = registerVM.Email.ToUpper();
                user.NormalizedUserName = registerVM.UserName.ToUpper();

                if (registerVM.Password != "")
                {
                    user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, registerVM.Password);
                }

                _context.Users.Update(user);


                var result = _context.SaveChanges();
                if (result != 0)
                {
                    return Ok();
                }
                return BadRequest("can not update");
            }
            
            return BadRequest("update failed");
        }
        
        [HttpDelete("delete-user-by-id/{id}")]
        public IActionResult DeleteUserById(Guid id)
        {
            var result = _customerService.Delete(id);

            if( result != 0 ) 
            {
                return Ok();
            }

            return BadRequest("Delete user failed");
        }

        [HttpGet("get-all-user-and-role")]
        public IActionResult GetAllUserRole()
        {
            return Ok(_context.UserRoles.ToList());
        }

        // thay đổi quyền người dùng : cần xem lại do vướng khóa roleId
        [HttpGet("Update-user-role")]
        public async Task<IActionResult> UpdateUserRole(Guid userId, Guid roleId)
        {

            var user = await _userManager.FindByIdAsync(userId.ToString());

            if (user == null)
            {
                return NotFound("User not found");
            }

            var role = await _roleManager.FindByIdAsync(roleId.ToString());

            if (role == null)
            {
                return NotFound("Role not found");
            }

            var userRole = _context.UserRoles.Find(userId.ToString());

            return Ok(userRole);

        }

        [HttpGet("get-user-equal-email/{email}")]
        public IActionResult GetUserEqualEmail(string email)
        {
            return Ok(_customerService.GetByEmail(email));
        }

        [HttpPut("update-account-id/{id}")]
        public IActionResult UpdateAccount(Guid id,AccountUser accountUser)
        {
            var result = _customerService.UpdateAccount(id, accountUser);

            if (result == 0)
            {
                return BadRequest("update failed");
            }

            return Ok();
        }
    }
}
