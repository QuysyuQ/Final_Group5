using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ViewModels
{
    public class ProductVM
    {
        public string Title { get; set; } // tên sản phẩm
        public int Price { get; set; } // giá sản phẩm
        public int Discount { get; set; } // giá sản phẩm có giảm giá
        public string Thumbnail { get; set; } // hình ảnh
        public string[]? size { get; set; }
        public string? Preserve { get; set; } // bảo quản
        public string? Description { get; set; } // mô tả
        public int Quantity { get; set; } // số lượng
        public Guid CategoryId { get; set; }
    }
}
