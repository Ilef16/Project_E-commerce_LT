using Ecommerce.Api.Models;

namespace Ecommerce.Api.Common;

public static class Pricing
{
    // prix de base, moins la remise, plus la taxe
    public static decimal Final(Product p)
    {
        var afterDiscount = p.Price * (1 - p.DiscountPercent / 100m);
        return Math.Round(afterDiscount * (1 + p.TaxPercent / 100m), 2, MidpointRounding.AwayFromZero);
    }
} 