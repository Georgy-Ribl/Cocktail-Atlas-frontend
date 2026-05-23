import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { RecipeCard, type RecipeQuery, type RecipeSummary } from '@/entities/recipe';
import type { Ingredient, ReferenceItem } from '@/entities/reference';
import { catalogService } from '@/shared/api/services/catalog.service';
import s from './home.module.scss';

const quickFilters = ['Все', 'Шейк', 'Стир', 'Билд', 'Низкая крепость'];

const quickFilterQuery: Record<string, Partial<RecipeQuery>> = {
  Шейк: { methodTypeId: 1 },
  Стир: { methodTypeId: 3 },
  Билд: { methodTypeId: 4 },
  'Низкая крепость': { maxAbv: 15 },
};

const buildQuery = ({
  search,
  selectedIngredientId,
  selectedGlassTypeId,
  selectedIceTypeId,
  activeQuickFilter,
}: {
  search: string;
  selectedIngredientId?: number;
  selectedGlassTypeId?: number;
  selectedIceTypeId?: number;
  activeQuickFilter: string;
}): RecipeQuery => ({
  q: search.trim() || undefined,
  ingredientIds: selectedIngredientId ? [selectedIngredientId] : undefined,
  glassTypeId: selectedGlassTypeId,
  iceTypeId: selectedIceTypeId,
  page: 1,
  pageSize: 20,
  ...quickFilterQuery[activeQuickFilter],
});

export const HomePage = () => {
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [glassTypes, setGlassTypes] = useState<ReferenceItem[]>([]);
  const [iceTypes, setIceTypes] = useState<ReferenceItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedIngredientId, setSelectedIngredientId] = useState<number>();
  const [selectedGlassTypeId, setSelectedGlassTypeId] = useState<number>();
  const [selectedIceTypeId, setSelectedIceTypeId] = useState<number>();
  const [activeQuickFilter, setActiveQuickFilter] = useState(quickFilters[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRecipes = useCallback(async (query: RecipeQuery) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await catalogService.getRecipes(query);
      setRecipes(response.items ?? []);
    } catch {
      setRecipes([]);
      setError('Не удалось загрузить рецепты. Проверьте соединение с сервером.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.all([catalogService.getIngredients(), catalogService.getGlassTypes(), catalogService.getIceTypes()])
      .then(([apiIngredients, apiGlassTypes, apiIceTypes]) => {
        setIngredients(apiIngredients);
        setGlassTypes(apiGlassTypes);
        setIceTypes(apiIceTypes);
      })
      .catch(() => {
        setIngredients([]);
        setGlassTypes([]);
        setIceTypes([]);
      });

    loadRecipes(buildQuery({ search: '', activeQuickFilter: quickFilters[0] }));
  }, [loadRecipes]);

  const recipeCountText = useMemo(() => `${recipes.length} рецептов`, [recipes.length]);

  const handleApplyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    loadRecipes(
      buildQuery({
        search,
        selectedIngredientId,
        selectedGlassTypeId,
        selectedIceTypeId,
        activeQuickFilter,
      })
    );
  };

  const handleQuickFilter = (filter: string) => {
    setActiveQuickFilter(filter);
    loadRecipes(
      buildQuery({
        search,
        selectedIngredientId,
        selectedGlassTypeId,
        selectedIceTypeId,
        activeQuickFilter: filter,
      })
    );
  };

  const handleSelectIngredient = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedIngredientId(event.target.value ? Number(event.target.value) : undefined);
  };

  const handleSelectGlassType = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedGlassTypeId(event.target.value ? Number(event.target.value) : undefined);
  };

  const handleSelectIceType = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedIceTypeId(event.target.value ? Number(event.target.value) : undefined);
  };

  return (
    <main className={s.homePage}>
      <header className={s.header}>
        <a className={s.logo} href="/">
          Cocktail Atlas
        </a>
        <nav className={s.nav} aria-label="Основная навигация">
          <a href="/">Каталог</a>
          <a href="/collections">Коллекции</a>
          <a href="/recipes/new">Публикация</a>
          <a href="/profile">Профиль</a>
        </nav>
        <a className={s.addRecipeButton} href="/recipes/new">
          Добавить рецепт
        </a>
      </header>

      <form className={s.filtersPanel} onSubmit={handleApplyFilters}>
        <label className={s.searchField}>
          <span>Поиск</span>
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="По названию"
          />
        </label>

        <label className={s.selectField}>
          <span>Фильтр по ингредиентам</span>
          <select value={selectedIngredientId ?? ''} onChange={handleSelectIngredient}>
            <option value="">Все ингредиенты</option>
            {ingredients.map(ingredient => (
              <option key={ingredient.id} value={ingredient.id}>
                {ingredient.name}
              </option>
            ))}
          </select>
        </label>

        <label className={s.selectField}>
          <span>Тип бокала</span>
          <select value={selectedGlassTypeId ?? ''} onChange={handleSelectGlassType}>
            <option value="">Все бокалы</option>
            {glassTypes.map(glassType => (
              <option key={glassType.id} value={glassType.id}>
                {glassType.name}
              </option>
            ))}
          </select>
        </label>

        <label className={s.selectField}>
          <span>Тип льда</span>
          <select value={selectedIceTypeId ?? ''} onChange={handleSelectIceType}>
            <option value="">Любой лёд</option>
            {iceTypes.map(iceType => (
              <option key={iceType.id} value={iceType.id}>
                {iceType.name}
              </option>
            ))}
          </select>
        </label>

        <button className={s.applyButton} type="submit">
          Применить фильтры
        </button>
      </form>

      <section className={s.quickFilters} aria-label="Быстрые фильтры">
        {quickFilters.map(filter => (
          <button
            className={filter === activeQuickFilter ? s.quickFilterActive : s.quickFilter}
            key={filter}
            onClick={() => handleQuickFilter(filter)}
            type="button">
            {filter}
          </button>
        ))}
      </section>

      <section className={s.catalogHeader}>
        <div>
          <h1>Популярные рецепты</h1>
          <p>{isLoading ? 'Загрузка...' : recipeCountText}</p>
        </div>
      </section>

      <section className={s.recipeGrid} aria-label="Каталог рецептов">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </section>
      {error && <p className={s.emptyState}>{error}</p>}
      {!isLoading && !error && !recipes.length && (
        <p className={s.emptyState}>По выбранным фильтрам рецепты не найдены.</p>
      )}
    </main>
  );
};
