using BocchiTheAPI.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace BocchiTheAPI.Controllers;

[ApiController]
public class QuizController : ControllerBase
{
    private readonly IClusterClient _client;

    public QuizController(IClusterClient client)
    {
        _client = client;
    }

    [HttpGet]
    [Route("quiz/{room}")]
    public async Task<ActionResult<string>> Get(Guid room, CancellationToken cancellationToken = default)
    {
        var grain = _client.GetGrain<IBocchiQuizGrain>(room);
        var frame = await grain.GetCurrentFrame();
        if (frame == null) return NotFound("No frame found");
        return $"http://{Request.Host.ToString()}/img/{frame.identifier}.png";
    }
}