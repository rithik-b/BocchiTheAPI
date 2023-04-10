using BocchiTheAPI.Abstractions;
using BocchiTheAPI.Abstractions.Extensions;
using BocchiTheAPI.Abstractions.Models;
using SurrealDB.Abstractions;

namespace BocchiTheAPI.Grains;

public class BocchiQuizGrain : Grain, IBocchiQuizGrain
{
    private readonly IDatabase _db;
    private BocchiFrame? CurrentFrame { get; set; }

    public BocchiQuizGrain(IDatabase db)
    {
        _db = db;
    }
    
    public async Task<BocchiFrame?> GetCurrentFrame()
    {
        CurrentFrame ??= await _db.GetFrame(null, CancellationToken.None);
        return CurrentFrame;
    }
}