using BocchiTheAPI.Common.Extensions;
using BocchiTheAPI.Common.Models;
using BocchiTheAPI.Quiz.Grains.Interfaces;
using BocchiTheAPI.Quiz.Hubs;
using BocchiTheAPI.Quiz.Models;
using Microsoft.AspNetCore.SignalR;
using SurrealDB.Abstractions;

namespace BocchiTheAPI.Quiz.Grains;

public class BocchiQuizGrain : Grain, IBocchiQuizGrain
{
    private readonly IDatabase _db;
    private readonly IHubContext<QuizHub> _context; 
    private Dictionary<User, UserState> Users { get; } = new();
    private bool IsStarted { get; set; }
    private int CurrentRound { get; set; } = 1;
    private BocchiFrame? CurrentFrame { get; set; }
    private Rules Rules { get; set; } = new(20, 20);

    public BocchiQuizGrain(IDatabase db, IHubContext<QuizHub> context)
    {
        _db = db;
        _context = context;
    }

    public void Join(User user)
    { 
        Users[user] = new UserState();
    }
    
    public void Leave(User user)
    { 
        Users.Remove(user);
        if (Users.Count == 0)
            DeactivateOnIdle();
    }
    
    public async Task StartGame()
    {
        IsStarted = true;
        for (CurrentRound = 1; CurrentRound <= Rules.numRounds; CurrentRound++)
        {
            CurrentFrame = await _db.GetFrame(null, CancellationToken.None);
            await _context.Clients.All.SendAsync("OnRoundStart", CurrentRound, CurrentFrame);
            await Task.Delay(Rules.timePerRoundSeconds * 1000);
            foreach (var userState in Users.Values)
            {
                if (string.Equals(userState.Answer, EpisodeUtils.GetEpisodeFromSource(CurrentFrame!.source), StringComparison.OrdinalIgnoreCase))
                    userState.Score += 1;
            }
        }
        IsStarted = false;
    }

    public void UpdateAnswer(User user, string answer)
    {
        throw new NotImplementedException();
    }

    public Task<IReadOnlyList<User>> GetJoinedUsers() => Task.FromResult((IReadOnlyList<User>)Users.Keys.ToList());
    
    public Task<BocchiFrame?> GetCurrentFrame()
    {
        return Task.FromResult(IsStarted ? CurrentFrame : null);
    }
}