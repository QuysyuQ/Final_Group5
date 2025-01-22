using BLL.Services.IService;
using BLL.Services.Service;
using BLL.ViewModels;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClothingWebAPI_Update.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService<AppRole, RoleVM> _roleService;
        public RoleController(IRoleService<AppRole, RoleVM> roleService)
        {
            _roleService = roleService;
        }

        [HttpGet("get-all-roles")]
        public IActionResult GetAllRole()
        {
            return Ok(_roleService.GetAll());
        }

        [HttpGet("get-roles-page")]
        public IActionResult GetRolePage(int page, int pageSize)
        {
            var roles = _roleService.GetPage(page, pageSize);
            return Ok(roles);
        }

        [HttpGet("get-role-by-id/{id}")]
        public IActionResult GetRoleById(Guid id)
        {
            return Ok(_roleService.GetById(id));
        }

        [HttpPut("update-role-by-id/{id}")]
        public IActionResult UpdateRoleById(Guid id, [FromBody] RoleVM roleVM)
        {
            var result = _roleService.Update(id, roleVM);
            if (result == 1)
            {
                return Ok();
            }
            return BadRequest($"Can not update role Id = {id}");
        }

        [HttpGet("search-role-name")]
        public IActionResult GetRoleName(string? name)
        {

            return Ok(_roleService.Search(name));
        }
    }
}
