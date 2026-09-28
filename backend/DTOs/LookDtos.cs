using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Api.DTOs;

public class LookItemRequest
{
    [Range(1, int.MaxValue)] public int ProductId { get; set; }
    /// <summary>Position horizontale en % (0 à 100).</summary>
    [Range(0, 100)] public double X { get; set; }
    /// <summary>Position verticale en % (0 à 100).</summary>
    [Range(0, 100)] public double Y { get; set; }
}

public class CreateLookRequest
{
    [Required, MaxLength(200)] public string Title { get; set; } = "";
    [Required, MaxLength(500)] public string ImageUrl { get; set; } = "";
    public List<LookItemRequest> Items { get; set; } = [];
}

public record LookItemDto(
    int Id, int ProductId, string Name, string? ImageUrl,
    decimal OriginalPrice, decimal DiscountPercent, decimal FinalPrice,
    double X, double Y, List<VariantDto> Variants);

public record LookDto(int Id, string Title, string ImageUrl, List<LookItemDto> Items);