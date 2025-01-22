using BLL.Services.IService;
using BLL.Services.Service;
using BLL.ViewModels;
using DAL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClothingWebAPI_Update.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayToMoneyController : ControllerBase
    {
        private readonly IPayToMoneyService<PayToMoney, PayToMoneyVM> _payToMoneyService;

        public PayToMoneyController(IPayToMoneyService<PayToMoney, PayToMoneyVM> payToMoneyService)
        {
            _payToMoneyService = payToMoneyService;
        }

        [HttpGet("get-all-pay-to-money")]
        public IActionResult GetAllPayToMoney()
        {
            return Ok(_payToMoneyService.GetAll());
        }

        [HttpGet("get-pay-to-money-by-id/{id}")]
        public IActionResult GetPayToMoneyById(Guid id)
        {
            return Ok(_payToMoneyService.GetById(id));
        }

        [HttpGet("get-pay-to-money-page")]
        public IActionResult GetPayToMoneyPage(int page, int pageSize)
        {
            var payToMoney = _payToMoneyService.GetPage(page, pageSize);
            return Ok(payToMoney);
        }

        [HttpPost("add-pay-to-money")]
        public IActionResult AddPayToMoney([FromBody] PayToMoneyVM payToMoneyVM)
        {
            var result = _payToMoneyService.Add(payToMoneyVM);
            if (result == 1)
            {
                return Ok("Add success !");
            }
            return BadRequest("Can not created pay to money");
        }

        [HttpPut("update-pay-to-money-by-id/{id}")]
        public IActionResult UpdatePayToMoneyById(Guid id, [FromBody] PayToMoneyVM payToMoneyVM)
        {
            var result = _payToMoneyService.Update(id, payToMoneyVM);

            if (result == 1)
            {
                return Ok("Update success !");
            }

            return BadRequest($"Can not update pay to money by id = {id}");
        }

        [HttpDelete("delete-pay-to-money-by-id/{id}")]
        public IActionResult DeletePayToMoneyById(Guid id)
        {
            var result = _payToMoneyService.Delete(id);

            if (result == 1)
            {
                return Ok("Delete success !");
            }

            return BadRequest($"Can not delete pay to money by id = {id}");
        }

        [HttpGet("search-poy-to-money-name")]
        public IActionResult GetCategoryName(string name)
        {

            return Ok(_payToMoneyService.Search(name));
        }
    }
}
