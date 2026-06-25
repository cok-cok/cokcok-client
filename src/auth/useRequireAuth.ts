import { useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useToast } from '../components/Toast';
import type { RootStackParamList } from '../navigation/types';

// TODO: 실제 인증 상태 도입 시 교체. 현재는 비로그인 가정.
const IS_AUTHENTICATED = false;

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function useRequireAuth() {
  const toast = useToast();
  const navigation = useNavigation<NavProp>();

  return useCallback(
    (action: () => void) => {
      if (IS_AUTHENTICATED) {
        action();
        return;
      }
      toast.warning('로그인이 필요합니다', {
        id: 'auth-required',
        position: 'bottom',
        action: {
          label: '로그인',
          onPress: () => navigation.navigate('Login'),
        },
      });
    },
    [toast, navigation],
  );
}
