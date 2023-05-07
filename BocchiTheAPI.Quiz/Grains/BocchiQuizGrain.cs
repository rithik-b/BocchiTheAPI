using BocchiTheAPI.Common;
using BocchiTheAPI.Common.Extensions;
using BocchiTheAPI.Common.Models;
using BocchiTheAPI.Quiz.Models;
using SurrealDB.Abstractions;

namespace BocchiTheAPI.Grains;

public class BocchiQuizGrain : Grain, IBocchiQuizGrain
{
    private readonly IDatabase _db;
    private List<User> JoinedUsers { get; } = new();
    private BocchiFrame? CurrentFrame { get; set; }

    public BocchiQuizGrain(IDatabase db)
    {
        _db = db;
    }
    
    public void Join(User user)
    {
        if (JoinedUsers.All(x => x.id != user.id))
            JoinedUsers.Add(user);
    }
    
    public void Leave(User user)
    { 
        JoinedUsers.Remove(user);
        if (JoinedUsers.Count == 0)
            DeactivateOnIdle();
    }
    
    public Task<IReadOnlyList<User>> GetJoinedUsers() => Task.FromResult((IReadOnlyList<User>)JoinedUsers.AsReadOnly());
    
    public async Task<BocchiFrame?> GetCurrentFrame()
    {
        CurrentFrame ??= await _db.GetFrame(null, CancellationToken.None);
        return CurrentFrame;
    }
}