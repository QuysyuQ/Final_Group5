using BLL.Services.IService;
using BLL.Services.Service;
using BLL.ViewModels;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Runtime.InteropServices;

namespace ClothingWebAPI_Update.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService<Category, CategoryVM> _categoryService;
        public CategoryController(ICategoryService<Category, CategoryVM> categoryService)
        {
            _categoryService = categoryService;
        }

     
        [HttpGet("get-all-categories")]
        public IActionResult GetAllCategories()
        {
            return Ok(_categoryService.GetAll());
        }

        [HttpGet("get-categories-page")]
        public IActionResult GetCategoriesPage(int page, int pageSize)
        {
            var categories = _categoryService.GetPage(page, pageSize);
            return Ok(categories);
        }

        [HttpGet("get-category-by-id/{id}")]
        public IActionResult GetCategoryById(Guid id)
        {
            return Ok(_categoryService.GetById(id));
        }

        [HttpPost("add-category")]
        public IActionResult AddCategory([FromBody] CategoryVM categoryVM)
        {
            var result = _categoryService.Add(categoryVM);
            if (result == 1)
            {
                return Ok();
            }
            return BadRequest("Can not add category! ");
        }

        [HttpPut("update-category-by-id/{id}")]
        public IActionResult UpdateCategoryById(Guid id, [FromBody] CategoryVM categoryVM)
        {
            var result = _categoryService.Update(id, categoryVM);
            if (result == 1)
            {
                return Ok();
            }
            return BadRequest($"Can not update category Id = {id}");
        }

        [HttpDelete("delete-category-by-id/{id}")]
        public IActionResult DeleteCategoryById(Guid id)
        {
            var result = _categoryService.Delete(id);
            if (result == 1)
            {
                return Ok();
            }
            return BadRequest($"Can not delete category Id = {id}");
        }

        [HttpGet("search-category-name")]
        public IActionResult GetCategoryName(string? name)
        {

            return Ok(_categoryService.Search(name));
        }
    }
}
