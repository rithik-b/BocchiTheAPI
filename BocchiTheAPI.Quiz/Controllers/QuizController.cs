using BocchiTheAPI.Common;
using BocchiTheAPI.Common.Models;
using BocchiTheAPI.Quiz.Models;
using Microsoft.AspNetCore.Mvc;

namespace BocchiTheAPI.Quiz.Controllers;

[ApiController]
public class QuizController : ControllerBase
{
    private readonly IClusterClient _client;
    private readonly IConfiguration _config;

    public QuizController(IClusterClient client, IConfiguration config)
    {
        _client = client;
        _config = config;
    }
    
    [HttpGet]
    [Route("quiz/{room}/users")]
    public async Task<ActionResult<IReadOnlyList<User>>> GetUsers(Guid room)
    {
        var grain = _client.GetGrain<IBocchiQuizGrain>(room);
        return Ok(await grain.GetJoinedUsers());
    }

    [HttpGet]
    [Route("quiz/{room}")]
    public async Task<ActionResult<string>> Get(Guid room, CancellationToken cancellationToken = default)
    {
        var grain = _client.GetGrain<IBocchiQuizGrain>(room);
        var frame = await grain.GetCurrentFrame();
        if (frame == null) return NotFound("No frame found");
        return $"{_config["ApiUrl"]}/img/{frame.identifier}.png";
    }
    
    [HttpPost]
    [Route("quiz/{room}/submit")]
    public async Task<ActionResult<bool>> Submit(Guid room, [FromBody] string episode, CancellationToken cancellationToken = default)
    {
        var normalizedEpisode = episode.Trim().ToLower();
        var grain = _client.GetGrain<IBocchiQuizGrain>(room);
        var frame = await grain.GetCurrentFrame();
        if (frame == null) return NotFound("No frame found");
        return frame.source == EpisodeUtils.GetSourceFromNormalizedEpisode(normalizedEpisode);
    }
}