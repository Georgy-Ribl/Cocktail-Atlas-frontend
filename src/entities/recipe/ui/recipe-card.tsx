import type { RecipeSummary } from '../model/types';
import { getMediaUrl } from '@/shared/api/helpers/get-media-url';
import s from './recipe-card.module.scss';

interface RecipeCardProps {
  recipe: RecipeSummary;
}

const formatRating = (rating?: number | null) => (rating ? rating.toFixed(1) : '0.0');

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <article className={s.recipeCard}>
      <img alt={recipe.name ?? 'Коктейль'} className={s.recipeImage} src={getMediaUrl(recipe.imageUrl)} />
      <div className={s.recipeBody}>
        <h2>{recipe.name}</h2>
        <p>{recipe.shortDescription}</p>
        <div className={s.recipeMeta}>
          <span>* {formatRating(recipe.averageRating)}</span>
          <span>{recipe.glassType}</span>
          <span>{recipe.abvPercent ? `${Math.round(recipe.abvPercent)}% крепости` : 'крепость не указана'}</span>
        </div>
        <a className={s.recipeLink} href={`/recipes/${recipe.id}`}>
          Посмотреть рецепт
        </a>
      </div>
    </article>
  );
};
