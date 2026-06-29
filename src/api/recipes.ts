import {
  MOCK_RECIPES,
  RECIPES_FAKE_LATENCY_MS,
  RECIPES_USE_MOCK,
} from '../mocks/recipes.mock';
import { apiRequest } from './client';

export type CookTime = {
  hour: number;
  minute: number;
};

export type Recipe = {
  id: number;
  title: string;
  thumbnailUrl: string;
  description: string;
  tags: string[];
  cookTime: CookTime;
  portion: number;
};

export type GetMyRecipesParams = {
  page?: number;
  size?: number;
};

export type GetMyRecipesResponse = {
  recipes: Recipe[];
  nextPage: number | null;
};

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 20;

export async function getMyRecipes(
  params: GetMyRecipesParams = {},
): Promise<GetMyRecipesResponse> {
  const page = params.page ?? DEFAULT_PAGE;
  const size = params.size ?? DEFAULT_SIZE;

  if (RECIPES_USE_MOCK) {
    await new Promise<void>((r) => setTimeout(r, RECIPES_FAKE_LATENCY_MS));
    const start = (page - 1) * size;
    const end = start + size;
    const slice = MOCK_RECIPES.slice(start, end);
    const nextPage = end < MOCK_RECIPES.length ? page + 1 : null;
    return { recipes: slice, nextPage };
  }

  return apiRequest<GetMyRecipesResponse>(`/api/recipes/my?page=${page}&size=${size}`);
}
