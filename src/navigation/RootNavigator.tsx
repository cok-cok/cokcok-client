import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LegalDocumentPage from '../pages/LegalDocumentPage';
import LoginPage from '../pages/LoginPage';
import MyPage from '../pages/MyPage';
import MyRecipeListPage from '../pages/MyRecipeListPage';
import RecipeDetailPage from '../pages/RecipeDetailPage';
import RecipeFormPage from '../pages/RecipeFormPage';
import SettingsPage from '../pages/SettingsPage';
import SignupPage from '../pages/SignupPage';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator id={undefined} initialRouteName="MyRecipeList">
      <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupPage} options={{ headerShown: false }} />
      <Stack.Screen
        name="LegalDocument"
        component={LegalDocumentPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyRecipeList"
        component={MyRecipeListPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="RecipeForm" component={RecipeFormPage} options={{ title: '레시피 작성' }} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailPage} options={{ title: '레시피 상세' }} />
      <Stack.Screen name="MyPage" component={MyPage} options={{ title: '마이' }} />
      <Stack.Screen name="Settings" component={SettingsPage} options={{ title: '설정' }} />
    </Stack.Navigator>
  );
}
