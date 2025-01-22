using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Product
    {
        public Guid Id { get; set; }
        [MaxLength(255)]
        public string Title { get; set; } // tên sản phẩm
        public int Price { get; set; } // giá sản phẩm
        public int Discount { get; set; } // giá sản phẩm có giảm giá
        public string Thumbnail { get; set; } // hình ảnh
        public string[]? size { get; set; } // kích thước sản phẩm
        [MaxLength(500)]
        public string? Description { get; set; } // mô tả
        public string? Preserve { get; set; } // bảo quản
        public DateTime CreatedAt { get; set; } // ngày tạo 
        public DateTime UpdatedAt { get; set; } // ngày sửa
        public int Quantity { get; set; } // số lượng

        [ForeignKey("CategoryId")]
        public Guid CategoryId { get; set; }
        public Category Category { get; set; }
    }
}
