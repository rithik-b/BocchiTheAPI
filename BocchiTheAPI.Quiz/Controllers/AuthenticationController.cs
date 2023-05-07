using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BocchiTheAPI.Quiz.Controllers;

[Authorize]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly IClusterClient _client;
    private readonly IConfiguration _config;

    public AuthenticationController(IClusterClient client, IConfiguration config)
    {
        _client = client;
        _config = config;
    }
    
    [AllowAnonymous]
    [HttpGet]
    [Route("auth/signin")]
    public IActionResult SignIn()
    {
        return Challenge(new AuthenticationProperties { RedirectUri = $"{_config["WebApplicationUrl"]}/quiz" }, "Discord");
    }
    
    [HttpPost]
    [Route("auth/signout")]
    public async Task<IActionResult> SignOut()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok();
    }
    
    [HttpGet]
    [Route("auth/me")]
    public async Task<IActionResult> Me()
    {
        return Ok(new
        {
            User.Identity?.Name,
            Discriminator = User.FindFirst("urn:discord:user:discriminator")?.Value,
            AvatarUrl = User.FindFirst("urn:discord:avatar:url")?.Value,
            Id = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value,
        });
    }
}