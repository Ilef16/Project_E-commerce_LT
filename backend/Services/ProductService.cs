using Ecommerce.Api.Common;
using Ecommerce.Api.Data;
using Ecommerce.Api.DTOs;
using Ecommerce.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Services;

public interface IProductService
{
    Task<List<ProductDto>> GetAllAsync();
    Task<ProductDto> GetByIdAsync(int id);
    Task<ProductDto> CreateAsync(CreateProductRequest request);
    Task<ProductDto> UpdateAsync(int id, UpdateProductRequest request);
    Task DeleteAsync(int id);
    Task<VariantDto> AddVariantAsync(int productId, CreateVariantRequest request);
}

public class ProductService(AppDbContext db) : IProductService
{
    private IQueryable<Product> Query() =>
        db.Products.Include(p => p.Images).Include(p => p.Variants).AsSplitQuery();

    public async Task<List<ProductDto>> GetAllAsync() =>
        (await Query().AsNoTracking().OrderBy(p => p.Id).ToListAsync())
            .Select(p => p.ToDto()).ToList();

    public async Task<ProductDto> GetByIdAsync(int id)
    {
        var product = await Query().AsNoTracking().FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new NotFoundException($"Produit {id} introuvable.");
        return product.ToDto();
    }

    public async Task<ProductDto> CreateAsync(CreateProductRequest r)
    {
        var variants = (r.Variants ?? []).Select(v => new ProductVariant
        {
            Size = v.Size.Trim().ToUpperInvariant(),
            Color = v.Color.Trim(),
            Quantity = v.Quantity
        }).ToList();

        if (variants.GroupBy(v => (v.Size, Color: v.Color.ToLowerInvariant())).Any(g => g.Count() > 1))
            throw new BusinessException("Deux variantes ont la même taille et la même couleur.");

        var product = new Product
        {
            Name = r.Name.Trim(),
            Description = r.Description,
            Price = r.Price,
            DiscountPercent = r.DiscountPercent,
            TaxPercent = r.TaxPercent,
            Style = r.Style,
            Material = r.Material,
            LengthCm = r.LengthCm,
            MainImageUrl = r.MainImageUrl,
            Images = (r.ImageUrls ?? []).Select(u => new ProductImage { Url = u }).ToList(),
            Variants = variants
        };

        // historique : le stock de départ est enregistré comme un mouvement
        foreach (var v in variants.Where(v => v.Quantity > 0))
            db.StockMovements.Add(new StockMovement { Variant = v, Delta = v.Quantity, Reason = "Stock initial" });

        db.Products.Add(product);
        await db.SaveChangesAsync();
        return product.ToDto();
    }

    public async Task<ProductDto> UpdateAsync(int id, UpdateProductRequest r)
    {
        var product = await Query().FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new NotFoundException($"Produit {id} introuvable.");

        product.Name = r.Name.Trim();
        product.Description = r.Description;
        product.Price = r.Price;
        product.DiscountPercent = r.DiscountPercent;
        product.TaxPercent = r.TaxPercent;
        product.Style = r.Style;
        product.Material = r.Material;
        product.LengthCm = r.LengthCm;
        product.MainImageUrl = r.MainImageUrl;

        await db.SaveChangesAsync();
        return product.ToDto();
    }

    public async Task DeleteAsync(int id)
    {
        var product = await db.Products.FindAsync(id)
            ?? throw new NotFoundException($"Produit {id} introuvable.");

        if (await db.LookItems.AnyAsync(i => i.ProductId == id))
            throw new BusinessException("Ce produit est utilisé dans une photo. Retirez-le d'abord de la photo.");

        db.Products.Remove(product);
        await db.SaveChangesAsync();
    }

    public async Task<VariantDto> AddVariantAsync(int productId, CreateVariantRequest r)
    {
        if (!await db.Products.AnyAsync(p => p.Id == productId))
            throw new NotFoundException($"Produit {productId} introuvable.");

        var size = r.Size.Trim().ToUpperInvariant();
        var color = r.Color.Trim();

        var exists = await db.ProductVariants.AnyAsync(v =>
            v.ProductId == productId && v.Size == size && v.Color.ToLower() == color.ToLower());
        if (exists)
            throw new BusinessException("Cette variante existe déjà. Utilisez l'ajout de stock.");

        var variant = new ProductVariant
        {
            ProductId = productId, Size = size, Color = color, Quantity = r.Quantity
        };
        db.ProductVariants.Add(variant);
        if (r.Quantity > 0)
            db.StockMovements.Add(new StockMovement { Variant = variant, Delta = r.Quantity, Reason = "Stock initial" });

        await db.SaveChangesAsync();
        return variant.ToDto();
    }
}