import type { IngredientPagedResponse, ReferenceItem } from '@/entities/reference';
import type { RecipeDetails, RecipePagedResponse, RecipeQuery } from '@/entities/recipe';
import { axiosClassic } from '@/shared/api/helpers/set-instances-auth-header';

const buildRecipeParams = (query: RecipeQuery) => ({
  ...query,
  ingredientIds: query.ingredientIds?.join(','),
});

const unwrapReferenceItems = (data: ReferenceItem[] | { value?: ReferenceItem[] }) => {
  if (Array.isArray(data)) return data;

  return data.value ?? [];
};

export const catalogService = {
  async getRecipes(query: RecipeQuery = {}) {
    const response = await axiosClassic.get<RecipePagedResponse>('recipes', {
      params: buildRecipeParams({ page: 1, pageSize: 20, ...query }),
    });

    return response.data;
  },

  async getRecipeDetails(recipeId: number) {
    const response = await axiosClassic.get<RecipeDetails>(`recipes/${recipeId}`);

    return response.data;
  },

  async getIngredients(q = '') {
    const response = await axiosClassic.get<IngredientPagedResponse>('ingredients', {
      params: { q, page: 1, pageSize: 30 },
    });

    return response.data.items ?? [];
  },

  async getGlassTypes() {
    const response = await axiosClassic.get<ReferenceItem[] | { value?: ReferenceItem[] }>('glass-types');

    return unwrapReferenceItems(response.data);
  },

  async getIceTypes() {
    const response = await axiosClassic.get<ReferenceItem[] | { value?: ReferenceItem[] }>('ice-types');

    return unwrapReferenceItems(response.data);
  },

  async getMethods() {
    const response = await axiosClassic.get<ReferenceItem[] | { value?: ReferenceItem[] }>('methods');

    return unwrapReferenceItems(response.data);
  },
};
