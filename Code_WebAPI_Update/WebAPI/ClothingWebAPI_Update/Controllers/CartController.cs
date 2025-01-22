using BLL.Services.IService;
using BLL.Services.Service;
using BLL.ViewModels;
using DAL.Data;
using DAL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SqlServer.Server;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Runtime.InteropServices;

namespace ClothingWebAPI_Update.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartService<Cart, CartVM> _cartService;
        private readonly ClothingAppDbContext _context;

        public CartController(ICartService<Cart, CartVM> cartService , ClothingAppDbContext context)
        {
            _cartService = cartService;
            _context = context;
        }

        [HttpGet("get-all-cart")]
        public IActionResult GetAllCart()
        {
            return Ok(_cartService.GetAll());
        }

        [HttpGet("get-cart-userId/{id}")]
        public IActionResult GetCartById(Guid id)
        {
            var carts = _cartService.GetAll().Where(c =>  c.UserId == id);

            return Ok(carts);
        }

        [HttpPost("add-cart")]
        public IActionResult AddCart([FromBody]  CartVM cartVM) 
        {
            _cartService.Add(cartVM);
            return Ok();
        }

        [HttpPut("update-cart-userId/{userId}/{productId}")]
        public IActionResult UpdateCartByUserId(Guid userId, Guid productId, int quantity)
        {

            var result = _cartService.Update(userId, productId, quantity);
            if(result != 0)
            {
                return Ok();
            }
            return BadRequest("Update failed");

        }

        [HttpDelete("delete-product-in-cart/{userId}/{productId}")]
        public IActionResult DeleteCartById(Guid userId, Guid productId)
        {
            var result = _cartService.Delete(userId, productId);
            if (result != 0)
            {
                return Ok();
            }
            return BadRequest("delete failed");
        }

        [HttpDelete("delete-all-product-in-cart-userId/{userId}")]
        public IActionResult DeleteAllCartById(Guid userId)
        {
            var result = _cartService.Delete(userId);
            if (result != 0)
            {
                return Ok();
            }
            return BadRequest("delete failed");
        }
    }
}
