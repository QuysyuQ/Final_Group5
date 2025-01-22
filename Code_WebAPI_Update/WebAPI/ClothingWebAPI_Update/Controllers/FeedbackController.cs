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
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService<Feedback, FeedbackVM> _feedbackService;

        public FeedbackController(IFeedbackService<Feedback, FeedbackVM> feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet("get-all-feedback")]
        public IActionResult GetAllFeedback()
        {
            return Ok(_feedbackService.GetAll());
        }

        [HttpGet("get-feedback-by-id/{id}")]
        public IActionResult GetFeedbackById(Guid id)
        {
            return Ok(_feedbackService.GetById(id));
        }

        [HttpGet("get-feedback-page")]
        public IActionResult GetFeedbackPage(int page, int pageSize)
        {
            var feedback = _feedbackService.GetPage(page, pageSize);
            return Ok(feedback);
        }

        [HttpPost("add-feedback")]
        public IActionResult AddFeedback([FromBody] FeedbackVM feedbackVM)
        {
            var result = _feedbackService.Add(feedbackVM);

            if (result == 0)
            {
                return BadRequest("Can not add feedback !");
            }
            return Ok();
        }

        [HttpPut("update-feedback-by-id/{id}")]
        public IActionResult Update(Guid id, [FromBody] FeedbackVM feedbackVM)
        {
            var result = _feedbackService.Update(id, feedbackVM);

            if (result == 0)
            {
                return BadRequest("Can not update feedback !");
            }
            return Ok();
        }

        [HttpDelete("delete-feedback-by-id/{id}")]
        public IActionResult DeleteFeedback(Guid id)
        {
            var result = _feedbackService.Delete(id);

            if (result == 0)
            {
                return BadRequest("Can not delete feedback !");
            }
            return Ok();
        }

        [HttpGet("search-feedback-name")]
        public IActionResult GetCategoryName(string name)
        {

            return Ok(_feedbackService.Search(name));
        }

        [HttpGet("get-feedback-by-product/{productId}")]
        public IActionResult GetFeedbackByProductId(Guid productId)
        {
            var feedback = _feedbackService.GetByReviewProductId(productId);
            if (feedback == null || !feedback.Any())
            {
                return NotFound("No feedback found for this product.");
            }
            return Ok(feedback);
        }
    }
}
