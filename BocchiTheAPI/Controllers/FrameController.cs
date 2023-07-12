using BocchiTheAPI.Common.Extensions;
using BocchiTheAPI.Common.Models;
using BocchiTheAPI.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SurrealDB.Abstractions;

namespace BocchiTheAPI.Controllers;

[ApiController]
public class FrameController : ControllerBase
{
    private static readonly string[] episodes = { "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "op", "ed1", "ed2", "ed3" };
    private readonly IDatabase _db;

    public FrameController(IDatabase db)
    {
        _db = db;
    }

    [HttpGet]
    [EnableCors("AllowAll")]
    [Route("api/frames")]
    public async Task<ActionResult<BocchiFrameResponse>> Get([FromQuery] string? episode, CancellationToken cancellationToken = default)
    {
        var normalizedEpisode = episode?.Trim().ToLower();
        if (normalizedEpisode != null && !episodes.Contains(normalizedEpisode))
            return BadRequest("Invalid episode");
        var frame = await _db.GetFrame(normalizedEpisode, cancellationToken);
        if (frame == null) return NotFound("No frame found");
        return new BocchiFrameResponse
        {
            Url =  $"http://{Request.Host.ToString()}/img/{frame.identifier}.png",
            Episode = EpisodeUtils.GetEpisodeFromSource(frame.source),
            Timestamp = frame.timestamp
        };
    }
    
    [HttpGet]
    [Route("api/nya")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<ActionResult<BocchiFrameResponse>> GetLegacy([FromQuery] string? episode, CancellationToken cancellationToken = default)
    {
        var normalizedEpisode = episode?.Trim().ToLower();
        if (normalizedEpisode != null && !episodes.Contains(normalizedEpisode))
            return BadRequest("Invalid episode");
        var frame = await _db.GetFrame(normalizedEpisode, cancellationToken);
        if (frame == null) return NotFound("No frame found");
        return new BocchiFrameResponse
        {
            Url =  $"{Request.Host.ToString()}/img/{frame.identifier}.png",
            Episode = EpisodeUtils.GetEpisodeFromSource(frame.source),
            Timestamp = frame.timestamp
        };
    }
}
