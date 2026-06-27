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
  hasMore: boolean;
};

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 20;

export function getMyRecipes(params: GetMyRecipesParams = {}): Promise<GetMyRecipesResponse> {
  const page = params.page ?? DEFAULT_PAGE;
  const size = params.size ?? DEFAULT_SIZE;
  return apiRequest<GetMyRecipesResponse>(`/api/recipes/my?page=${page}&size=${size}`);
}
