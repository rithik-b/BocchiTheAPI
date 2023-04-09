using BocchiTheAPI.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SurrealDB.Abstractions;
using SurrealDB.Models.Result;

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
        var frame = await GetFrame(normalizedEpisode, cancellationToken);
        if (frame == null) return NotFound("No frame found");
        return new BocchiFrameResponse
        {
            Url =  $"http://{Request.Host.ToString()}/img/{frame.identifier}.png",
            Episode = GetEpisodeFromSource(frame.source),
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
        var frame = await GetFrame(normalizedEpisode, cancellationToken);
        if (frame == null) return NotFound("No frame found");
        return new BocchiFrameResponse
        {
            Url =  $"{Request.Host.ToString()}/img/{frame.identifier}.png",
            Episode = GetEpisodeFromSource(frame.source),
            Timestamp = frame.timestamp
        };
    }

    [HttpGet]
    [Route("api/internal")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<ActionResult<BocchiFrameResponse>> GetInternal([FromQuery] string? episode, [FromQuery] string apiUrl, CancellationToken cancellationToken = default)
    {
        var normalizedEpisode = episode?.Trim().ToLower();
        if (normalizedEpisode != null && !episodes.Contains(normalizedEpisode)) 
            return BadRequest("Invalid episode");
        var frame = await GetFrame(normalizedEpisode, cancellationToken);
        if (frame == null) return NotFound("No frame found");
        return new BocchiFrameResponse
        {
            Url =  $"http://{apiUrl}/img/{frame.identifier}.png",
            Episode = GetEpisodeFromSource(frame.source),
            Timestamp = frame.timestamp
        };
    }

    private async Task<BocchiFrame?> GetFrame(string? normalizedEpisode, CancellationToken cancellationToken)
    {
        await _db.Open(cancellationToken);
        var source = GetSourceFromNormalizedEpisode(normalizedEpisode);
        var query = await _db.Query($"SELECT * FROM frame{(source == null ? "" : " WHERE source = $source")} ORDER BY rand() LIMIT 1;", new Dictionary<string, object?> {{ "source", source }}, cancellationToken);
        if (!query.TryGetFirstValue(out var res)) return null;
        var frame = res.GetObject<BocchiFrame>();
        return frame;
    }
    
    private string? GetSourceFromNormalizedEpisode(string? normalizedEpisode)
        => normalizedEpisode switch
        {
            null => null,
            "op" => "mv:op",
            "ed1" => "mv:ed1",
            "ed2" => "mv:ed2",
            "ed3" => "mv:ed3",
            _ => $"episode:{normalizedEpisode}"
        };
    
    private string? GetEpisodeFromSource(string source)
        => source switch
        {
            "mv:op" => "op",
            "mv:ed1" => "ed1",
            "mv:ed2" => "ed2",
            "mv:ed3" => "ed3",
            _ => source.Replace("episode:", "")
        };
}
