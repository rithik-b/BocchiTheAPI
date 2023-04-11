using BocchiTheAPI.Common.Models;
using Orleans;

namespace BocchiTheAPI.Common;

public interface IBocchiQuizGrain : IGrainWithGuidKey
{
    public Task<BocchiFrame?> GetCurrentFrame();
}