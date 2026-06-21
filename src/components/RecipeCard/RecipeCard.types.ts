export type RecipeCardLayout = 'horizontal' | 'vertical';

export type RecipeCardCookTime = {
  hour?: number;
  minute?: number;
};

export type RecipeCardProps = {
  title: string;
  thumbnailUrl?: string;
  description?: string;
  tags?: string[];
  cookTime?: RecipeCardCookTime;
  portion?: number;

  layout?: RecipeCardLayout;
  onPress?: () => void;

  testID?: string;
};
