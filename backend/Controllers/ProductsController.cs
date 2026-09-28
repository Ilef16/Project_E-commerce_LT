using Ecommerce.Api.DTOs;
using Ecommerce.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ProductsController(IProductService service) : ControllerBase
{
    /// <summary>Liste des produits avec variantes, stock et prix final.</summary>
    [HttpGet]
    public async Task<ActionResult<List<ProductDto>>> GetAll() =>
        Ok(await service.GetAllAsync());

    /// <summary>Détail d'un produit.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto>> GetById(int id) =>
        Ok(await service.GetByIdAsync(id));

    /// <summary>Créer un produit avec ses photos et ses variantes (taille + couleur + stock).</summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProductDto>> Create(CreateProductRequest request)
    {
        var product = await service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    /// <summary>Modifier les informations d'un produit (les variantes et le stock ne sont pas touchés).</summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto>> Update(int id, UpdateProductRequest request) =>
        Ok(await service.UpdateAsync(id, request));

    /// <summary>Supprimer un produit (refusé s'il est utilisé dans une photo).</summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }

    /// <summary>Ajouter une variante (taille + couleur) à un produit.</summary>
    [HttpPost("{id:int}/variants")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VariantDto>> AddVariant(int id, CreateVariantRequest request)
    {
        var variant = await service.AddVariantAsync(id, request);
        return CreatedAtAction(nameof(GetById), new { id }, variant);
    }
}