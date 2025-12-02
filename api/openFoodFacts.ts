// Open Food Facts API Service
// Free, open-source food product database
// https://world.openfoodfacts.org/

export interface OpenFoodFactsProduct {
  product_name?: string;
  brands?: string;
  categories?: string;
  image_url?: string;
  code: string;
}

export interface ProductLookupResult {
  found: boolean;
  product?: {
    name: string;
    brand?: string;
    category?: string;
    imageUrl?: string;
    barcode: string;
  };
  error?: string;
}

const OPEN_FOOD_FACTS_API = "https://world.openfoodfacts.org/api/v2/product";

/**
 * Look up a product by its barcode using Open Food Facts API
 * @param barcode - The barcode number to look up
 * @returns Product information if found
 */
export const lookupProductByBarcode = async (
  barcode: string,
): Promise<ProductLookupResult> => {
  try {
    const response = await fetch(
      `${OPEN_FOOD_FACTS_API}/${barcode}.json?fields=product_name,brands,categories,image_url,code`,
      {
        headers: {
          "User-Agent": "MyFridge App - Android/iOS - Version 6.0",
        },
      },
    );

    if (!response.ok) {
      return {
        found: false,
        error: "API request failed",
      };
    }

    const data = await response.json();

    if (data.status === 0 || !data.product) {
      return {
        found: false,
        error: "Product not found",
      };
    }

    const product = data.product as OpenFoodFactsProduct;

    let name = product.product_name || "";

    if (
      product.brands &&
      !name.toLowerCase().includes(product.brands.toLowerCase())
    ) {
      name = product.brands + (name ? " " + name : "");
    }

    name = name.trim();

    if (!name) {
      return {
        found: false,
        error: "Product found but no name available",
      };
    }

    return {
      found: true,
      product: {
        name,
        brand: product.brands,
        category: product.categories?.split(",")[0]?.trim(),
        imageUrl: product.image_url,
        barcode: product.code,
      },
    };
  } catch (error) {
    console.error("[OpenFoodFacts] Error looking up product:", error);
    return {
      found: false,
      error: "Network error",
    };
  }
};
