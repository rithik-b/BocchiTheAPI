using BocchiTheAPI.Quiz.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BocchiTheAPI.Quiz.Controllers;

[Authorize]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly IConfiguration _config;

    public AuthenticationController(IConfiguration config)
    {
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
    public new async Task<IActionResult> SignOut()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok();
    }
    
    [HttpGet]
    [Route("auth/me")]
    public ActionResult<User> Me()
    {
        return Ok(Utils.GenerateUserFromClaimsPrincipal(User));
    }
}