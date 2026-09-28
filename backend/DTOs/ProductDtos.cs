using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Api.DTOs;

public class CreateVariantRequest
{
    /// <summary>Taille en lettres : S, M, L, XL...</summary>
    [Required, MaxLength(10)] public string Size { get; set; } = "";
    [Required, MaxLength(50)] public string Color { get; set; } = "";
    /// <summary>Stock initial.</summary>
    [Range(0, 100000)] public int Quantity { get; set; }
}

public class UpdateProductRequest
{
    [Required, MaxLength(200)] public string Name { get; set; } = "";
    [MaxLength(2000)] public string? Description { get; set; }
    /// <summary>Prix HT de base.</summary>
    [Range(0, 1000000)] public decimal Price { get; set; }
    /// <summary>Remise en % (0 à 100).</summary>
    [Range(0, 100)] public decimal DiscountPercent { get; set; }
    /// <summary>Taxe en % (0 à 100).</summary>
    [Range(0, 100)] public decimal TaxPercent { get; set; }
    [MaxLength(100)] public string? Style { get; set; }
    [MaxLength(100)] public string? Material { get; set; }
    [Range(0, 1000)] public int? LengthCm { get; set; }
    [MaxLength(500)] public string? MainImageUrl { get; set; }
}

public class CreateProductRequest : UpdateProductRequest
{
    public List<string>? ImageUrls { get; set; }
    public List<CreateVariantRequest>? Variants { get; set; }
}

public record VariantDto(int Id, string Size, string Color, int Quantity);

public record ProductDto(
    int Id, string Name, string? Description,
    decimal Price, decimal DiscountPercent, decimal TaxPercent, decimal FinalPrice,
    string? Style, string? Material, int? LengthCm, string? MainImageUrl,
    List<string> Images, List<VariantDto> Variants, int TotalStock);