namespace Ecommerce.Api.Models;

public class StockMovement
{
    public int Id { get; set; }
    public int VariantId { get; set; }
    public ProductVariant Variant { get; set; } = null!;
    public int Delta { get; set; }            
    public string Reason { get; set; } = "";
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}