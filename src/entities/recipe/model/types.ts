export interface Author {
  id: number;
  login?: string | null;
  displayName: string | null;
}

export interface RecipeSummary {
  id: number;
  name: string | null;
  shortDescription: string | null;
  imageUrl?: string | null;
  glassType: string | null;
  iceType?: string | null;
  method?: string | null;
  ingredientIds?: number[];
  isFavorite?: boolean;
  averageRating?: number | null;
  ratingCount: number;
  abvPercent?: number | null;
  author: Author;
}

export interface RecipeIngredient {
  ingredientId: number;
  ingredientName: string | null;
  amountMl: number;
  unit: string;
  kind: string;
  isGarnish: boolean;
  abvPercent?: number | null;
  position: number;
}

export interface RecipeComment {
  id: number;
  recipeId: number;
  authorId: number;
  authorLogin: string | null;
  text: string | null;
  createdAt: string;
}

export interface RecipeDetails extends RecipeSummary {
  preparation: string;
  history?: string | null;
  ingredients: RecipeIngredient[];
  comments: RecipeComment[];
}

export interface RecipePagedResponse {
  items: RecipeSummary[] | null;
  page: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface RecipeQuery {
  q?: string;
  ingredientIds?: number[];
  methodTypeId?: number;
  glassTypeId?: number;
  iceTypeId?: number;
  minAbv?: number;
  maxAbv?: number;
  page?: number;
  pageSize?: number;
}
