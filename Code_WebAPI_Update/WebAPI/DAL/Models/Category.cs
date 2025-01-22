using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Category
    {
        public Guid Id { get; set; }
        [MaxLength(150)]
        [MinLength(4)]
        public string Name { get; set; } // quần nỉ, quần đùi,...
    }
}
