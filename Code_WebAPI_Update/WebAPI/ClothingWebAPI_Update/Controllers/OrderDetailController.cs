using BLL.Services.IService;
using BLL.Services.Service;
using BLL.ViewModels;
using DAL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Metrics;
using System.Runtime.InteropServices;
using System.Security.Cryptography;

namespace ClothingWebAPI_Update.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailController : ControllerBase
    {
        private readonly IOrderDetailService<OrderDetails, OrderDetailVM> _orderDetailService;
        public OrderDetailController(IOrderDetailService<OrderDetails, OrderDetailVM> orderDetailService)
        {
            _orderDetailService = orderDetailService;
        }

        [HttpGet("get-all-order-detail")]
        public IActionResult GetAllOrderDetail() 
        {
            return Ok(_orderDetailService.GetAll());
        }

        [HttpGet("get-order-detail-by-id/{id}")]
        public IActionResult GetOrderDetail(Guid id)
        {
            return Ok(_orderDetailService.GetById(id));
        }

        [HttpPost("add-order-detail")]
        public IActionResult AddOrderDetail([FromBody] OrderDetailVM orderDetailVM)
        {
            var result = _orderDetailService.Add(orderDetailVM);

            if(result != 0)
            {
                return Ok();
            }

            return BadRequest("Can not add order detail");
        }

        [HttpDelete("delete-order-detail-by-id/{id}")]
        public IActionResult DeleteOrderDetail(Guid id)
        {
            var result = _orderDetailService.Delete(id);

            if(result != 0 )
            {
                return Ok();
            }

            return BadRequest("delete failed");
        }

        [HttpGet("get-all-order-detail-in-orderId/{orderId}")]
        public IActionResult GetAllOrderDetailInOrderId(Guid orderId)
        {
            return Ok(_orderDetailService.GetAllOrderDetailInOrderId(orderId));
        }
    }
}
