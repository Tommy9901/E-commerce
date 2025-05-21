import { Request, Response } from "express";
import { Product } from "../model/productModel";

interface CategoryFilter {
  categoryType?: string;
  size?: string;
}

interface CategoryQuery {
  categoryType?: string;
  size?: string;
}

export const getCategory = async (req: Request, res: Response) => {
  try {
    const { categoryType, size } = req.query as CategoryQuery;
    const filter: CategoryFilter = {};

    // Input validation
    if (categoryType && typeof categoryType === 'string') {
      filter.categoryType = categoryType.trim();
    }

    if (size && typeof size === 'string') {
      filter.size = size.trim();
    }

    // Log the filter for debugging
    console.log('Category filter:', filter);

    // Find products with filter
    const products = await Product.find(filter).sort({ createdAt: -1 });

    // Check if products were found
    if (!products.length) {
      return res.status(200).json({
        success: true,
        message: 'No products found for the given criteria',
        data: []
      });
    }

    // Return successful response
    return res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products
    });

  } catch (error) {
    console.error('Error in getCategory:', error);

    // Return error response
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};
