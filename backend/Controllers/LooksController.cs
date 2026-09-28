using Ecommerce.Api.DTOs;
using Ecommerce.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class LooksController(ILookService service) : ControllerBase
{
    /// <summary>Liste des photos avec leurs articles cliquables.</summary>
    [HttpGet]
    public async Task<ActionResult<List<LookDto>>> GetAll() =>
        Ok(await service.GetAllAsync());

    /// <summary>Une photo avec ses articles, leurs prix finaux et leurs variantes.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<LookDto>> GetById(int id) =>
        Ok(await service.GetByIdAsync(id));

    /// <summary>Créer une photo avec ses points cliquables (X et Y en %).</summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<LookDto>> Create(CreateLookRequest request)
    {
        var look = await service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = look.Id }, look);
    }

    /// <summary>Ajouter un article cliquable sur une photo existante.</summary>
    [HttpPost("{id:int}/items")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<LookDto>> AddItem(int id, LookItemRequest request) =>
        Ok(await service.AddItemAsync(id, request));

    /// <summary>Retirer un article d'une photo.</summary>
    [HttpDelete("{id:int}/items/{itemId:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveItem(int id, int itemId)
    {
        await service.RemoveItemAsync(id, itemId);
        return NoContent();
    }

    /// <summary>Supprimer une photo (les produits ne sont pas supprimés).</summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }
}