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

const USE_MOCK_API = true;
const FAKE_LATENCY_MS = 600;

const MOCK_TOTAL = 56;

const MOCK_TITLES = [
  '청양고추 김밥',
  '버터 갈릭 새우',
  '들기름 막국수',
  '두부 김치',
  '에어프라이어 닭다리',
  '토마토 파스타',
  '미소된장찌개',
  '가지 볶음',
  '연어 포케볼',
  '깻잎 페스토 파스타',
  '오트밀 그래놀라',
  '바질 마르게리타 피자',
  '간장계란밥',
  '명란 아보카도 덮밥',
  '두유 단호박 수프',
];

const MOCK_DESCRIPTIONS_LONG = [
  '냉장고 재료만으로 후다닥 만들 수 있는 든든한 한 끼',
  '향긋한 마늘과 버터 풍미가 살아있는 간단 양식',
  '비빔 한 그릇으로 끝나는 여름철 별미',
  '재료가 단순할수록 본연의 맛이 살아나는 메뉴',
  '에어프라이어로 기름 없이 바삭하게 즐기는 한 그릇',
];

const MOCK_DESCRIPTIONS_SHORT = [
  '간단 메모',
  '재료만 챙기면 끝',
  '비상시 메뉴',
  '5분 컷',
  '냉장고 정리용',
];

const MOCK_TAG_POOL = [
  '간단',
  '집밥',
  '저녁',
  '한식',
  '양식',
  '디저트',
  '에어프라이어',
  '20분',
  '비건',
  '도시락',
];

const MOCK_THUMB_IDS = [
  '1546069901-ba9599a7e63c',
  '1567620905732-2d1ec7ab7445',
  '1565299624946-b28f40a0ae38',
  '1551782450-a2132b4ba21d',
  '1565958011703-44f9829ba187',
  '1551183053-bf91a1d81141',
  '1504674900247-0877df9cc836',
  '1473093295043-cdd812d0e601',
];

const MOCK_ASPECTS: readonly (readonly [number, number])[] = [
  [400, 400],
  [400, 300],
  [400, 500],
  [400, 600],
  [400, 350],
];

function makeMockRecipe(id: number): Recipe {
  const hasImage = (id * 7) % 10 < 7;
  const title = MOCK_TITLES[(id * 13) % MOCK_TITLES.length] ?? `레시피 ${id}`;
  const description = hasImage
    ? (MOCK_DESCRIPTIONS_LONG[(id * 17) % MOCK_DESCRIPTIONS_LONG.length] ?? '')
    : (MOCK_DESCRIPTIONS_SHORT[(id * 17) % MOCK_DESCRIPTIONS_SHORT.length] ?? '');
  const tagCount = (id % 3) + 1;
  const tags = Array.from(
    { length: tagCount },
    (_, k) => MOCK_TAG_POOL[(id + k * 5) % MOCK_TAG_POOL.length] ?? '',
  );
  const thumbId = MOCK_THUMB_IDS[(id * 11) % MOCK_THUMB_IDS.length] ?? '';
  const aspect = MOCK_ASPECTS[(id * 5) % MOCK_ASPECTS.length] ?? [400, 400];
  return {
    id,
    title,
    thumbnailUrl: hasImage
      ? `https://images.unsplash.com/photo-${thumbId}?w=${aspect[0]}&h=${aspect[1]}&fit=crop`
      : '',
    description,
    tags,
    cookTime: { hour: 0, minute: 10 + (id % 8) * 5 },
    portion: 1 + (id % 4),
  };
}

const MOCK_RECIPES: Recipe[] = Array.from({ length: MOCK_TOTAL }, (_, i) =>
  makeMockRecipe(i + 1),
);

export async function getMyRecipes(
  params: GetMyRecipesParams = {},
): Promise<GetMyRecipesResponse> {
  const page = params.page ?? DEFAULT_PAGE;
  const size = params.size ?? DEFAULT_SIZE;

  if (USE_MOCK_API) {
    await new Promise<void>((r) => setTimeout(r, FAKE_LATENCY_MS));
    const start = (page - 1) * size;
    const end = start + size;
    const slice = MOCK_RECIPES.slice(start, end);
    const nextPage = end < MOCK_RECIPES.length ? page + 1 : null;
    return { recipes: slice, nextPage };
  }

  return apiRequest<GetMyRecipesResponse>(`/api/recipes/my?page=${page}&size=${size}`);
}
