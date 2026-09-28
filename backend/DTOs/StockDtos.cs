using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Api.DTOs;

public class StockChangeRequest
{
    [Range(1, 100000)] public int Quantity { get; set; }
    /// <summary>Achat, Vente, Retour, Correction...</summary>
    [MaxLength(50)] public string? Reason { get; set; }
    [MaxLength(500)] public string? Note { get; set; }
}

public record StockResultDto(int VariantId, int Quantity);

public record StockMovementDto(int Delta, string Reason, string? Note, DateTime CreatedAt);