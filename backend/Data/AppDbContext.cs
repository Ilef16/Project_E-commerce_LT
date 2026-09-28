using Ecommerce.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<StockMovement> StockMovements => Set<StockMovement>();
    public DbSet<Look> Looks => Set<Look>();
    public DbSet<LookItem> LookItems => Set<LookItem>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Product>(e =>
        {
            e.Property(p => p.Name).HasMaxLength(200).IsRequired();
            e.Property(p => p.Price).HasPrecision(18, 2);
            e.Property(p => p.DiscountPercent).HasPrecision(5, 2);
            e.Property(p => p.TaxPercent).HasPrecision(5, 2);
        });

        b.Entity<ProductVariant>(e =>
        {
            e.Property(v => v.Size).HasMaxLength(10).IsRequired();
            e.Property(v => v.Color).HasMaxLength(50).IsRequired();
            // une seule variante par produit + taille + couleur
            e.HasIndex(v => new { v.ProductId, v.Size, v.Color }).IsUnique();
            // le stock ne peut jamais être négatif
            e.ToTable(t => t.HasCheckConstraint("CK_ProductVariants_Quantity", "\"Quantity\" >= 0"));
        });

        b.Entity<LookItem>(e =>
        {
            // on ne peut pas supprimer un produit utilisé dans une photo
            e.HasOne(i => i.Product).WithMany().HasForeignKey(i => i.ProductId)
             .OnDelete(DeleteBehavior.Restrict);
        });
    }
}