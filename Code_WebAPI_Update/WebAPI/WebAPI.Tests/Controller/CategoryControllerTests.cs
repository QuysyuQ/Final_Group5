using BLL.Services.IService;
using BLL.Services.Service;
using BLL.ViewModels;
using ClothingWebAPI_Update.Controllers;
using DAL.Infrastructure;
using DAL.Models;
using DAL.Repositories;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAPI.Tests.Controller
{
    [TestFixture]
    public class CategoryControllerTests
    {
        private Mock<ICategoryService<Category, CategoryVM>> _mockCategoryService;
        private CategoryController _categoryController;
        [SetUp]
        public void Setup()
        {
            // Tạo mock cho service
            _mockCategoryService = new Mock<ICategoryService<Category, CategoryVM>>();

            // Tạo instance của controller với service đã được mock
            _categoryController = new CategoryController(_mockCategoryService.Object);
        }
        [Test]
        public void GetAllCategories_ShouldReturnAllCategories()
        {
            // Arrange: Chuẩn bị dữ liệu giả (mock data)
            var categories = new List<Category>
            {
                new Category { Id = Guid.NewGuid(), Name = "Trẻ Em" },
                new Category { Id = Guid.NewGuid(), Name = "Phụ Kiện" },
            };

            // Thiết lập mock để GetAll trả về danh sách categories giả
            _mockCategoryService.Setup(service => service.GetAll()).Returns(categories);

            // Act: Gọi phương thức cần test từ controller
            var result = _categoryController.GetAllCategories();

            // Assert: Kiểm tra kết quả trả về
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult); // Đảm bảo kết quả không phải null
            Assert.AreEqual(200, okResult.StatusCode); // Kiểm tra mã trạng thái HTTP
            Assert.AreEqual(categories, okResult.Value); // Kiểm tra dữ liệu trả về
        }
        [Test]
        public void AddCategory_ShouldReturnOk_WhenCategoryIsAddedSuccessfully()
        {
            // Arrange: Chuẩn bị dữ liệu giả (categoryVM)
            var newCategory = new CategoryVM { Name = "Giày Dép" };


            // Thiết lập mock cho phương thức Add
            _mockCategoryService.Setup(service => service.Add(It.IsAny<CategoryVM>())).Returns(1); // Giả sử trả về 1 khi thêm thành công

            // Act: Gọi phương thức AddCategory từ controller
            var result = _categoryController.AddCategory(newCategory);

            // Assert: Kiểm tra kết quả trả về
            var okResult = result as OkResult;
            Assert.IsNotNull(okResult); // Đảm bảo kết quả trả về là Ok
            Assert.AreEqual(200, okResult.StatusCode); // Kiểm tra mã trạng thái HTTP
        }
        [Test]
        public void UpdateCategoryById_ShouldReturnOk_WhenCategoryIsUpdatedSuccessfully()
        {
            // Arrange: Tạo categoryVM và ID giả
            var categoryId = Guid.NewGuid();
            var categoryVM = new CategoryVM { Name = "Giày Dép" };

            // Cấu hình mock để phương thức Update trả về 1 (thành công)
            _mockCategoryService.Setup(service => service.Update(categoryId, categoryVM)).Returns(1);

            // Act: Gọi phương thức UpdateCategoryById từ controller
            var result = _categoryController.UpdateCategoryById(categoryId, categoryVM);

            // Assert: Kiểm tra kết quả trả về
            var okResult = result as OkResult;
            Assert.IsNotNull(okResult); // Kiểm tra rằng kết quả không phải null
            Assert.AreEqual(200, okResult.StatusCode); // Kiểm tra mã trạng thái HTTP
        }

        [Test]
        public void UpdateCategoryById_ShouldReturnBadRequest_WhenUpdateFails()
        {
            // Arrange: Tạo categoryVM và ID giả
            var categoryId = Guid.NewGuid();
            var categoryVM = new CategoryVM { Name = "Giày Dép" };

            // Cấu hình mock để phương thức Update trả về 0 (thất bại)
            _mockCategoryService.Setup(service => service.Update(categoryId, categoryVM)).Returns(0);

            // Act: Gọi phương thức UpdateCategoryById từ controller
            var result = _categoryController.UpdateCategoryById(categoryId, categoryVM);

            // Assert: Kiểm tra kết quả trả về là BadRequest
            var badRequestResult = result as BadRequestObjectResult;
            Assert.IsNotNull(badRequestResult); // Kiểm tra rằng kết quả là BadRequest
            Assert.AreEqual(400, badRequestResult.StatusCode); // Kiểm tra mã trạng thái HTTP
        }
        [Test]
        public void DeleteCategoryById_ShouldReturnOk_WhenCategoryIsDeletedSuccessfully()
        {
            // Arrange: Tạo ID category giả
            var categoryId = Guid.NewGuid();

            // Cấu hình mock để phương thức Delete trả về 1 (thành công)
            _mockCategoryService.Setup(service => service.Delete(categoryId)).Returns(1);

            // Act: Gọi phương thức DeleteCategoryById từ controller
            var result = _categoryController.DeleteCategoryById(categoryId);

            // Assert: Kiểm tra kết quả trả về
            var okResult = result as OkResult;
            Assert.IsNotNull(okResult); // Kiểm tra rằng kết quả không phải null
            Assert.AreEqual(200, okResult.StatusCode); // Kiểm tra mã trạng thái HTTP
        }

        [Test]
        public void DeleteCategoryById_ShouldReturnBadRequest_WhenDeleteFails()
        {
            // Arrange: Tạo ID category giả
            var categoryId = Guid.NewGuid();

            // Cấu hình mock để phương thức Delete trả về 0 (thất bại)
            _mockCategoryService.Setup(service => service.Delete(categoryId)).Returns(0);

            // Act: Gọi phương thức DeleteCategoryById từ controller
            var result = _categoryController.DeleteCategoryById(categoryId);

            // Assert: Kiểm tra kết quả trả về là BadRequest
            var badRequestResult = result as BadRequestObjectResult;
            Assert.IsNotNull(badRequestResult); // Kiểm tra rằng kết quả là BadRequest
            Assert.AreEqual(400, badRequestResult.StatusCode); // Kiểm tra mã trạng thái HTTP
        }
    }

}
