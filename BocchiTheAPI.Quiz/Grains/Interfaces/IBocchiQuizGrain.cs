using BocchiTheAPI.Common.Models;
using BocchiTheAPI.Quiz.Models;

namespace BocchiTheAPI.Quiz.Grains.Interfaces;

public interface IBocchiQuizGrain : IGrainWithGuidKey
{
    public Task<BocchiFrame?> GetCurrentFrame();
    public Task<IReadOnlyList<User>> GetJoinedUsers();
    public void Join(User user);
    public void Leave(User user);
    public Task StartGame();
    public void UpdateAnswer(User user, string answer);
}