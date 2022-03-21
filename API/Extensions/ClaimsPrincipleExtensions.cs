using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static string GetUsername(this ClaimsPrincipal claimsPrincipal)
        {
            return  claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
    }
}