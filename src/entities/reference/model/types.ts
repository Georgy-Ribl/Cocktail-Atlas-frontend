export interface ReferenceItem {
  id: number;
  name: string | null;
}

export interface Ingredient {
  id: number;
  name: string | null;
  isAlcoholDefault: boolean;
  defaultAbvPercent?: number | null;
}

export interface IngredientPagedResponse {
  items: Ingredient[] | null;
  page: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
