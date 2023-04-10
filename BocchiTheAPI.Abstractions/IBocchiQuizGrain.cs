using BocchiTheAPI.Abstractions.Models;

namespace BocchiTheAPI.Abstractions;

public interface IBocchiQuizGrain : IGrainWithGuidKey
{
    public Task<BocchiFrame?> GetCurrentFrame();
}