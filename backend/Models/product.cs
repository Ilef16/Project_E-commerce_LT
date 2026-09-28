namespace Ecommerce.Api.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public decimal Price { get; set; }            // prix HT de base
    public decimal DiscountPercent { get; set; }  // remise en %
    public decimal TaxPercent { get; set; }       // taxe en %
    public string? Style { get; set; }
    public string? Material { get; set; }
    public int? LengthCm { get; set; }
    public string? MainImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<ProductImage> Images { get; set; } = [];
    public List<ProductVariant> Variants { get; set; } = [];
}

public class ProductImage
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Url { get; set; } = "";
}

// Une variante = taille (lettre) + couleur, avec son propre stock
public class ProductVariant
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Size { get; set; } = "";
    public string Color { get; set; } = "";
    public int Quantity { get; set; }
}