using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Common;

public class ApiExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext context, Exception exception, CancellationToken ct)
    {
        var (status, title) = exception switch
        {
            NotFoundException => (StatusCodes.Status404NotFound, "Introuvable"),
            BusinessException => (StatusCodes.Status400BadRequest, "Requête invalide"),
            _ => (0, "")
        };
        if (status == 0) return false;   // les autres erreurs restent des 500

        context.Response.StatusCode = status;
        await context.Response.WriteAsJsonAsync(
            new ProblemDetails { Status = status, Title = title, Detail = exception.Message }, ct);
        return true;
    }
}