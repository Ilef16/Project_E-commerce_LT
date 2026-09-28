using Ecommerce.Api.Common;
using Ecommerce.Api.Data;
using Ecommerce.Api.DTOs;
using Ecommerce.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Services;

public interface ILookService
{
    Task<List<LookDto>> GetAllAsync();
    Task<LookDto> GetByIdAsync(int id);
    Task<LookDto> CreateAsync(CreateLookRequest request);
    Task<LookDto> AddItemAsync(int lookId, LookItemRequest request);
    Task RemoveItemAsync(int lookId, int itemId);
    Task DeleteAsync(int id);
}

public class LookService(AppDbContext db) : ILookService
{
    private IQueryable<Look> Query() =>
        db.Looks.Include(l => l.Items).ThenInclude(i => i.Product).ThenInclude(p => p.Variants)
                .AsSplitQuery();

    public async Task<List<LookDto>> GetAllAsync() =>
        (await Query().AsNoTracking().OrderBy(l => l.Id).ToListAsync())
            .Select(l => l.ToDto()).ToList();

    public async Task<LookDto> GetByIdAsync(int id)
    {
        var look = await Query().AsNoTracking().FirstOrDefaultAsync(l => l.Id == id)
            ?? throw new NotFoundException($"Photo {id} introuvable.");
        return look.ToDto();
    }

    public async Task<LookDto> CreateAsync(CreateLookRequest r)
    {
        await EnsureProductsExistAsync(r.Items.Select(i => i.ProductId));

        var look = new Look
        {
            Title = r.Title.Trim(),
            ImageUrl = r.ImageUrl,
            Items = r.Items.Select(i => new LookItem { ProductId = i.ProductId, X = i.X, Y = i.Y }).ToList()
        };
        db.Looks.Add(look);
        await db.SaveChangesAsync();
        return await GetByIdAsync(look.Id);
    }

    public async Task<LookDto> AddItemAsync(int lookId, LookItemRequest r)
    {
        if (!await db.Looks.AnyAsync(l => l.Id == lookId))
            throw new NotFoundException($"Photo {lookId} introuvable.");
        await EnsureProductsExistAsync([r.ProductId]);

        db.LookItems.Add(new LookItem { LookId = lookId, ProductId = r.ProductId, X = r.X, Y = r.Y });
        await db.SaveChangesAsync();
        return await GetByIdAsync(lookId);
    }

    public async Task RemoveItemAsync(int lookId, int itemId)
    {
        var item = await db.LookItems.FirstOrDefaultAsync(i => i.Id == itemId && i.LookId == lookId)
            ?? throw new NotFoundException($"Point {itemId} introuvable sur la photo {lookId}.");
        db.LookItems.Remove(item);
        await db.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var look = await db.Looks.FindAsync(id)
            ?? throw new NotFoundException($"Photo {id} introuvable.");
        db.Looks.Remove(look);
        await db.SaveChangesAsync();
    }

  private async Task EnsureProductsExistAsync(IEnumerable<int> productIds)
{
    var ids = productIds.Distinct().ToList();
    var existing = await db.Products
        .Where(p => ids.Contains(p.Id))
        .Select(p => p.Id)
        .ToListAsync();

    var missing = ids.Except(existing).ToList();
    if (missing.Count > 0)
        throw new BusinessException($"Produit(s) introuvable(s) : {string.Join(", ", missing)}.");
}
}