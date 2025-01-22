using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ViewModels
{
    public class FeedbackVM
    {
        [Range(0, 5)]
        public int Vote { get; set; }
        public string Comment { get; set; }
        public Guid ProductId { get; set; }
    }
}
