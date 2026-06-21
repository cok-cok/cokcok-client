import type { RecipeCardCookTime } from './RecipeCard.types';

const COOK_TIME_FALLBACK = '-';
const PORTION_FALLBACK = '-';
const PORTION_UNIT = '인분';

export function formatCookTime(cookTime: RecipeCardCookTime | undefined): string {
  const hour = cookTime?.hour ?? 0;
  const minute = cookTime?.minute ?? 0;
  if (hour <= 0 && minute <= 0) return COOK_TIME_FALLBACK;
  if (hour > 0 && minute > 0) return `${hour}시간 ${minute}분`;
  if (hour > 0) return `${hour}시간`;
  return `${minute}분`;
}

export function formatPortion(portion: number | undefined): string {
  if (portion === undefined || portion <= 0) return PORTION_FALLBACK;
  return `${portion}${PORTION_UNIT}`;
}
