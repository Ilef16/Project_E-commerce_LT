using Ecommerce.Api.DTOs;
using Ecommerce.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class VariantsController(IStockService stock) : ControllerBase
{
    /// <summary>Stock actuel d'une variante.</summary>
    [HttpGet("{id:int}/stock")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<StockResultDto>> GetStock(int id) =>
        Ok(await stock.GetStockAsync(id));

    /// <summary>Ajouter du stock (achat, réapprovisionnement, retour...).</summary>
    [HttpPost("{id:int}/stock")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<StockResultDto>> AddStock(int id, StockChangeRequest request) =>
        Ok(await stock.AddAsync(id, request));

    /// <summary>Retirer du stock (correction, casse...). Refusé si le stock est insuffisant.</summary>
    [HttpPost("{id:int}/stock/remove")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<StockResultDto>> RemoveStock(int id, StockChangeRequest request) =>
        Ok(await stock.RemoveAsync(id, request));

    /// <summary>Historique des mouvements de stock d'une variante.</summary>
    [HttpGet("{id:int}/stock-history")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<List<StockMovementDto>>> GetHistory(int id) =>
        Ok(await stock.GetHistoryAsync(id));
}