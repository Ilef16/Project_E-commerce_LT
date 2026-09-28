using Ecommerce.Api.DTOs;
using Ecommerce.Api.Models;

namespace Ecommerce.Api.Common;

public static class Mapping
{
    public static VariantDto ToDto(this ProductVariant v) =>
        new(v.Id, v.Size, v.Color, v.Quantity);

    public static ProductDto ToDto(this Product p) => new(
        p.Id, p.Name, p.Description,
        p.Price, p.DiscountPercent, p.TaxPercent, Pricing.Final(p),
        p.Style, p.Material, p.LengthCm, p.MainImageUrl,
        p.Images.Select(i => i.Url).ToList(),
        p.Variants.Select(v => v.ToDto()).ToList(),
        p.Variants.Sum(v => v.Quantity));

    public static LookItemDto ToDto(this LookItem i) => new(
        i.Id, i.ProductId, i.Product.Name, i.Product.MainImageUrl,
        i.Product.Price, i.Product.DiscountPercent, Pricing.Final(i.Product),
        i.X, i.Y,
        i.Product.Variants.Select(v => v.ToDto()).ToList());

    public static LookDto ToDto(this Look l) =>
        new(l.Id, l.Title, l.ImageUrl, l.Items.Select(i => i.ToDto()).ToList());
}