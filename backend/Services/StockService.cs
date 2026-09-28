using Ecommerce.Api.Common;
using Ecommerce.Api.Data;
using Ecommerce.Api.DTOs;
using Ecommerce.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Services;

public interface IStockService
{
    Task<StockResultDto> GetStockAsync(int variantId);
    Task<StockResultDto> AddAsync(int variantId, StockChangeRequest request);
    Task<StockResultDto> RemoveAsync(int variantId, StockChangeRequest request);
    Task<List<StockMovementDto>> GetHistoryAsync(int variantId);
}

public class StockService(AppDbContext db) : IStockService
{
    public async Task<StockResultDto> GetStockAsync(int variantId)
    {
        var v = await db.ProductVariants.AsNoTracking().FirstOrDefaultAsync(x => x.Id == variantId)
            ?? throw new NotFoundException($"Variante {variantId} introuvable.");
        return new StockResultDto(v.Id, v.Quantity);
    }

    public async Task<StockResultDto> AddAsync(int variantId, StockChangeRequest r)
    {
        await using var tx = await db.Database.BeginTransactionAsync();

        // incrément atomique, sûr même si deux personnes ajoutent en même temps
        var rows = await db.ProductVariants
            .Where(v => v.Id == variantId)
            .ExecuteUpdateAsync(s => s.SetProperty(v => v.Quantity, v => v.Quantity + r.Quantity));
        if (rows == 0) throw new NotFoundException($"Variante {variantId} introuvable.");

        db.StockMovements.Add(new StockMovement
        {
            VariantId = variantId, Delta = r.Quantity,
            Reason = string.IsNullOrWhiteSpace(r.Reason) ? "Achat" : r.Reason.Trim(),
            Note = r.Note
        });
        await db.SaveChangesAsync();
        await tx.CommitAsync();

        return await GetStockAsync(variantId);
    }

    // Servira aussi pour les ventes : le décrément est conditionnel,
    // donc impossible de vendre plus que le stock, même en cas de commandes simultanées.
    public async Task<StockResultDto> RemoveAsync(int variantId, StockChangeRequest r)
    {
        await using var tx = await db.Database.BeginTransactionAsync();

        var rows = await db.ProductVariants
            .Where(v => v.Id == variantId && v.Quantity >= r.Quantity)
            .ExecuteUpdateAsync(s => s.SetProperty(v => v.Quantity, v => v.Quantity - r.Quantity));

        if (rows == 0)
        {
            if (!await db.ProductVariants.AnyAsync(v => v.Id == variantId))
                throw new NotFoundException($"Variante {variantId} introuvable.");
            throw new BusinessException("Stock insuffisant.");
        }

        db.StockMovements.Add(new StockMovement
        {
            VariantId = variantId, Delta = -r.Quantity,
            Reason = string.IsNullOrWhiteSpace(r.Reason) ? "Correction" : r.Reason.Trim(),
            Note = r.Note
        });
        await db.SaveChangesAsync();
        await tx.CommitAsync();

        return await GetStockAsync(variantId);
    }

    public async Task<List<StockMovementDto>> GetHistoryAsync(int variantId)
    {
        if (!await db.ProductVariants.AnyAsync(v => v.Id == variantId))
            throw new NotFoundException($"Variante {variantId} introuvable.");

        return await db.StockMovements.AsNoTracking()
            .Where(m => m.VariantId == variantId)
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new StockMovementDto(m.Delta, m.Reason, m.Note, m.CreatedAt))
            .ToListAsync();
    }
}