using BLL.Services.IService;
using BLL.Services.Service;
using BLL.ViewModels;
using DAL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.Metrics;

namespace ClothingWebAPI_Update.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService<Order, OrderVM> _orderService;

        public OrderController(IOrderService<Order, OrderVM> orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("get-all-order")]
        public IActionResult GetAllOrder()
        {
            return Ok(_orderService.GetAll());
        }

        [HttpGet("get-order-by-id/{id}")]
        public IActionResult GetOrderById(Guid id)
        {
            return Ok(_orderService.GetById(id));
        }

        [HttpGet("get-order-page")]
        public IActionResult GetOrderPage(int page, int pageSize)
        {
            var order = _orderService.GetPage(page, pageSize);
            return Ok(order);
        }

        [HttpPost("add-order")]
        public IActionResult AddOrder(OrderVM orderVM)
        {

            var result = _orderService.Add(orderVM);

            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest("Add failed");
        }

        [HttpPut("update-order-by-id/{id}")]
        public IActionResult UpdateOrderById(Guid id, OrderVM orderVM)
        {
            var result = _orderService.Update(id, orderVM);

            if (result == 0)
            {
                return BadRequest($"Can not update order id = {id}!");
            }

            return Ok();
        }

        [HttpDelete("delete-order-by-id/{id}")]
        public ActionResult DeleteOrderById(Guid id)
        {
            var result = _orderService.Delete(id);

            if (result == 0)
            {
                return BadRequest($"Can not delete order id = {id}!");
            }

            return Ok();
        }

        [HttpGet("search-order-name")]
        public IActionResult GetCategoryName(string name, int? start, int? end, string? sort = "asc")
        {

            return Ok(_orderService.Search(name, start, end, sort));
        }

        [HttpGet("get-all-order-userId/{userId}")]
        public IActionResult GetAllOrderUserId(Guid userId)
        {
            return Ok(_orderService.GetAllOrderUserId(userId));
        }

        [HttpGet("update-status-order/{id}")]
        public IActionResult UpdateStatusOrderId(Guid id)
        {
            var result = _orderService.UpdateStatusOrder(id);

            if(result != 0)
            {
                return Ok();
            }
            else
            {
                return BadRequest("Update failed");
            }
        }
    }
}
