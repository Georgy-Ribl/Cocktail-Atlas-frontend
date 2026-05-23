import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import type { RecipeDetails } from '@/entities/recipe';
import { getMediaUrl } from '@/shared/api/helpers/get-media-url';
import { catalogService } from '@/shared/api/services/catalog.service';
import s from './recipe-details.module.scss';

const kindLabels: Record<string, string> = {
  alcohol: 'Алкоголь',
  non_alcohol: 'Безалкогольный',
  modifier: 'Модификатор',
  garnish: 'Украшение',
};

const formatRating = (rating?: number | null) => (rating ? rating.toFixed(1) : '0.0');

export const RecipeDetailsPage = () => {
  const { recipeId } = useParams();
  const [comment, setComment] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCollection, setIsInCollection] = useState(false);
  const [recipe, setRecipe] = useState<RecipeDetails>();
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const id = Number(recipeId);

    if (!id) {
      setIsNotFound(true);
      setIsLoading(false);

      return;
    }

    setIsLoading(true);
    catalogService
      .getRecipeDetails(id)
      .then(setRecipe)
      .catch(() => setIsNotFound(true))
      .finally(() => setIsLoading(false));
  }, [recipeId]);

  if (isNotFound) return <Navigate to="/" replace />;

  if (isLoading || !recipe) {
    return (
      <main className={s.page}>
        <p className={s.flowNote}>Загрузка рецепта...</p>
      </main>
    );
  }

  const authorName = recipe.author.displayName ?? recipe.author.login ?? 'Автор';

  return (
    <main className={s.page}>
      <header className={s.header}>
        <a className={s.logo} href="/">
          Cocktail Atlas
        </a>
        <nav className={s.nav} aria-label="Основная навигация">
          <a href="/help">Справка</a>
          <a href="/">Каталог</a>
          <a href="/collections">Коллекции</a>
          <a href="/recipes/new">Публикация</a>
          <a href="/profile">Профиль</a>
        </nav>
        <a className={s.addButton} href="/recipes/new">
          Добавить рецепт
        </a>
      </header>

      <section className={s.hero}>
        <img alt={recipe.name ?? 'Коктейль'} className={s.heroImage} src={getMediaUrl(recipe.imageUrl)} />

        <div className={s.heroInfo}>
          <h1>{recipe.name}</h1>
          <p className={s.lead}>{recipe.shortDescription}</p>

          <div className={s.authorLine}>
            <span>Автор: {authorName}</span>
            <span>
              * {formatRating(recipe.averageRating)} · {recipe.ratingCount} оценок
            </span>
          </div>

          <div className={s.actions}>
            <button className={s.primaryAction} onClick={() => setIsFavorite(value => !value)} type="button">
              {isFavorite ? 'В избранном' : 'Добавить в любимые'}
            </button>
            <button className={s.secondaryAction} onClick={() => setIsInCollection(value => !value)} type="button">
              {isInCollection ? 'В коллекции' : 'Добавить в коллекцию'}
            </button>
          </div>

          <dl className={s.badges}>
            <div>
              <dt>Тип бокала</dt>
              <dd>{recipe.glassType}</dd>
            </div>
            <div>
              <dt>Тип льда</dt>
              <dd>{recipe.iceType}</dd>
            </div>
            <div>
              <dt>Метод</dt>
              <dd>{recipe.method}</dd>
            </div>
          </dl>

          <section className={s.abvPanel}>
            <span>Рассчитанная крепость алкоголя</span>
            <strong>{recipe.abvPercent ? `${Math.round(recipe.abvPercent)}% крепости` : 'Не рассчитана'}</strong>
          </section>
        </div>
      </section>

      <section className={s.contentGrid}>
        <div className={s.leftColumn}>
          <section>
            <h2>Ингредиенты</h2>
            <div className={s.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Ингредиент</th>
                    <th>Количество</th>
                    <th>Единица измерения</th>
                    <th>Тип</th>
                    <th>Украшение</th>
                  </tr>
                </thead>
                <tbody>
                  {recipe.ingredients.map(ingredient => (
                    <tr key={`${ingredient.ingredientId}-${ingredient.position}`}>
                      <td>{ingredient.ingredientName}</td>
                      <td>{ingredient.amountMl}</td>
                      <td>{ingredient.unit}</td>
                      <td>{kindLabels[ingredient.kind] ?? ingredient.kind}</td>
                      <td>{ingredient.isGarnish ? 'Да' : 'Нет'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {recipe.history && (
            <section className={s.history}>
              <h2>История</h2>
              <p>{recipe.history}</p>
            </section>
          )}
        </div>

        <aside className={s.rightColumn}>
          <section>
            <h2>Приготовление</h2>
            <p className={s.preparation}>{recipe.preparation}</p>
          </section>

          <section className={s.comments}>
            <h2>Комментарии</h2>
            <textarea
              aria-label="Комментарий"
              onChange={event => setComment(event.target.value)}
              placeholder="Поделитесь своим отзывом..."
              value={comment}
            />
            <button className={s.commentButton} type="button">
              Отправить комментарий
            </button>

            <div className={s.commentList}>
              {recipe.comments.map(item => (
                <article className={s.commentCard} key={item.id}>
                  <strong>{item.authorLogin ?? 'Гость'}</strong>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
};
