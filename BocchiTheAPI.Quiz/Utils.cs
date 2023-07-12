using System.Security.Claims;
using BocchiTheAPI.Quiz.Models;

namespace BocchiTheAPI.Quiz;

public static class Utils
{
    public static User GenerateUserFromClaimsPrincipal(ClaimsPrincipal claimsPrincipal)
    {
        return new User(
            claimsPrincipal.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value!,
            claimsPrincipal.Identity?.Name!,
            claimsPrincipal.FindFirst("urn:discord:user:discriminator")?.Value!,
            claimsPrincipal.FindFirst("urn:discord:avatar:url")?.Value!);
    }
}