namespace Ecommerce.Api.Models;

// La photo d'ensemble
public class Look
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string ImageUrl { get; set; } = "";
    public List<LookItem> Items { get; set; } = [];
}

// Un point cliquable sur la photo, lié à un produit
public class LookItem
{
    public int Id { get; set; }
    public int LookId { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public double X { get; set; }   // % horizontal (0 à 100)
    public double Y { get; set; }   // % vertical (0 à 100)
}