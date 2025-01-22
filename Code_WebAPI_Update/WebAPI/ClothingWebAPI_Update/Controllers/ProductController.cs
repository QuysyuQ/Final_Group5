using BLL.Services.IService;
using BLL.Services.Service;
using BLL.ViewModels;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.Metrics;

namespace ClothingWebAPI_Update.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService<Product, ProductVM> _productService;

        public ProductController(IProductService<Product, ProductVM> productService)
        {
            _productService = productService;
        }

        [HttpGet("get-all-product")]
        public ActionResult GetAllProduct()
        {
            return Ok(_productService.GetAll());
        }

        [HttpGet("get-product-by-id/{id}")]
        public ActionResult GetProductById(Guid id)
        {
            return Ok(_productService.GetById(id));
        }

        [HttpGet("get-product-page")]
        public IActionResult GetProductsPage(int page, int pageSize)
        {
            var product = _productService.GetPage(page, pageSize);
            return Ok(product);
        }

        [HttpPost("add-product")]
        public ActionResult AddProduct([FromBody] ProductVM productVM)
        {
            var result = _productService.Add(productVM);

            if (result == 0)
            {
                return BadRequest("Can not add product! ");
            }
            return Ok();
        }

        [HttpPut("update-product-by-id/{id}")]
        public ActionResult UpdateProductById(Guid id, [FromBody] ProductVM productVM)
        {
            var result = _productService.Update(id, productVM);

            if (result == 0)
            {
                return BadRequest($"Can not update product by id = {id}! ");
            }
            return Ok();
        }

        [HttpDelete("delete-product-by-id/{id}")]
        public ActionResult DeleteProductById(Guid id)
        {
            var result = _productService.Delete(id);

            if (result == 0)
            {
                return BadRequest($"Can not delete product by id = {id}! ");
            }
            return Ok();
        }

        [HttpGet("search-product-name")]
        public IActionResult GetCategoryName(string name, int? start, int? end, string? sort = "asc")
        {

            return Ok(_productService.Search(name, start, end, sort));
        }

        [HttpGet("get-product-in-category")]
        public IActionResult GetProductInCategory(Guid categoryId, int? page, int? pageSize, string? sort)
        {
            return Ok(_productService.GetProductInCategory(categoryId, page, pageSize, sort));
        }

        [HttpGet("get-product-in-category-equal-price")]
        public IActionResult GetProductInCategoryEqualPrice(Guid categoryId, int? priceStart, int? priceEnd, int? page, int? pageSize)
        {
            return Ok(_productService.GetProductInCategoryEqualPrice(categoryId, priceStart, priceEnd, page, pageSize));
        }

        // update lại số lượng sản phẩm sau khi mua hàng
        [HttpPut("update-product-order")]
        public IActionResult UpdateQuantity(Guid id, int quantity) 
        {
            var result = (_productService.UpdateQuantity(id, quantity));

            if(result == 0) 
            {
                return BadRequest("Update failed");
            }

            return Ok();
        }
    }
}
