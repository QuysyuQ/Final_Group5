using BLL.Services.Base;

namespace BLL.Services.IService
{
    public interface ICartService<T, V> : IBaseService<T> where T : class where V : class
    {
        IEnumerable<T> GetAll();
        IEnumerable<T> GetById(Guid id);
        int Add(V entityVM);
        int Update(Guid userId, Guid productId, int entityVM);
        int Delete(Guid userId, Guid productId);
        int Delete(Guid userId);

    }
}
