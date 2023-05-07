using BocchiTheAPI.Common.Models;
using BocchiTheAPI.Quiz.Models;

namespace BocchiTheAPI.Common;

public interface IBocchiQuizGrain : IGrainWithGuidKey
{
    public Task<BocchiFrame?> GetCurrentFrame();
    public Task<IReadOnlyList<User>> GetJoinedUsers();
    public void Join(User user);
    public void Leave(User user);
}