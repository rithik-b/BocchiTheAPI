using BocchiTheAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace BocchiTheAPI.Controllers;

[ApiController]
[Route("api/frames")]
public class FrameController : ControllerBase
{
    private static readonly string[] episodes = { "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "OP", "ED1", "ED2", "ED3" };
    private static readonly Random random = new();
    
    private readonly IWebHostEnvironment _hostEnvironment;

    public FrameController(IWebHostEnvironment hostEnvironment)
    {
        _hostEnvironment = hostEnvironment;
    }

    [HttpGet]
    public ActionResult<BocchiFrameResponse> Get([FromQuery] string? episode)
    {
        var normalizedEpisode = episode != null ? episode.Trim().ToUpper() : episodes[random.Next(0, episodes.Length)];
        
        if (!episodes.Contains(normalizedEpisode))
        {
            return BadRequest("Invalid episode");
        }

        var episodeDirectory = Path.Combine("img", normalizedEpisode);
        var files = _hostEnvironment.WebRootFileProvider.GetDirectoryContents(episodeDirectory).Where(f => f.Name.EndsWith(".png"));
        var randomFile = files.ElementAt(new Random().Next(0, files.Count()));
        
        return new BocchiFrameResponse
        {
            Url =  $"{(Request.IsHttps ? "https" : "http")}://{Request.Host}/{episodeDirectory}/{randomFile.Name}"
        };
    }
}