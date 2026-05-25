import { type ReactNode, useRef, useState } from 'react';
import { Keyboard, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button, type ButtonVariant } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Input } from '../../components/Input';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MyRecipeList'>;

const noop = () => {};

export default function MyRecipeListPage({ navigation }: Props) {
  return (
    <ScrollView
      contentContainerStyle={{ padding: 16 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ gap: 28 }}>
          <Text style={titleStyle}>컴포넌트 보완 사항 — 케이스 검수</Text>

          <Group title="Button 보완">
            <Section title="variants (primary / secondary / text / danger / normal)">
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <Button variant="primary" label="primary" onPress={noop} />
                <Button variant="secondary" label="secondary" onPress={noop} />
                <Button variant="text" label="text" onPress={noop} />
                <Button variant="danger" label="danger" onPress={noop} />
                <Button variant="normal" label="normal" onPress={noop} />
              </View>
            </Section>

            <Section title="normal (회색 fill + 어두운 글자: 중립 액션 버튼)">
              <Button variant="normal" fullWidth label="저장" onPress={noop} />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button variant="normal" label="취소" onPress={noop} />
                <Button variant="normal" iconLeft={<Icon name="x" />} label="닫기" onPress={noop} />
                <Button variant="normal" disabled label="비활성" onPress={noop} />
              </View>
            </Section>

            <Section title="loading (수동, 1.5초 후 복귀)">
              <LoadingButton variant="primary" label="저장하기" fullWidth />
              <LoadingButton variant="secondary" label="이메일 인증" />
              <LoadingButton variant="text" label="확인" />
              <LoadingButton variant="danger" label="삭제" />
            </Section>

            <Section title="async onPress 자동 loading (Promise 반환)">
              <Button
                variant="primary"
                fullWidth
                label="비동기 호출 (1.5s)"
                onPress={() => new Promise((resolve) => setTimeout(resolve, 1500))}
              />
            </Section>

            <Section title="icon-only (label 없음, accessibilityLabel 필수)">
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Button iconLeft={<Icon name="x" color="white" />} accessibilityLabel="닫기" onPress={noop} />
                <Button
                  variant="secondary"
                  iconLeft={<Icon name="chevronLeft" />}
                  accessibilityLabel="뒤로가기"
                  onPress={noop}
                />
                <Button
                  variant="danger"
                  iconLeft={<Icon name="trash" color="white" />}
                  accessibilityLabel="삭제"
                  onPress={noop}
                />
                <Button
                  variant="text"
                  iconLeft={<Icon name="settings" />}
                  accessibilityLabel="설정"
                  onPress={noop}
                />
              </View>
            </Section>

            <Section title="Icon 자동 size (Button size에 따라 16/18/20)">
              <Button size="sm" iconLeft={<Icon name="plus" color="white" />} label="sm" onPress={noop} />
              <Button size="md" iconLeft={<Icon name="plus" color="white" />} label="md" onPress={noop} />
              <Button size="lg" iconLeft={<Icon name="plus" color="white" />} label="lg" onPress={noop} />
            </Section>

            <Section title="haptic feedback (light / medium / heavy)">
              <Button variant="primary" haptic="light" label="light" onPress={noop} />
              <Button variant="primary" haptic="medium" label="medium" onPress={noop} />
              <Button variant="danger" haptic="heavy" label="heavy" onPress={noop} />
            </Section>

            <Section title="pressedStyle override (눌렀을 때 보라색)">
              <Button
                variant="primary"
                label="눌러보세요"
                pressedStyle={{ backgroundColor: 'purple' }}
                onPress={noop}
              />
            </Section>

            <Section title="sm 자동 hitSlop (눈에 안 보이는 6px 보정)">
              <Button size="sm" label="작은 버튼이지만 잘 눌림" onPress={noop} />
            </Section>
          </Group>

          <Group title="Icon 보완">
            <Section title="장식용 (accessibilityLabel 없음) — 스크린리더 무시">
              <View style={iconRowStyle}>
                <Icon name="search" />
                <Icon name="user" />
                <Icon name="settings" />
                <Icon name="clock" />
              </View>
            </Section>

            <Section title="의미 있는 아이콘 (accessibilityLabel + auto role='image')">
              <View style={iconRowStyle}>
                <Icon name="alertCircle" color="#DC2626" accessibilityLabel="에러" />
                <Icon name="check" color="#16A34A" accessibilityLabel="완료" />
                <Icon name="search" accessibilityLabel="검색" testID="icon-search" />
              </View>
            </Section>

            <Section title="testID + 명시적 role override">
              <View style={iconRowStyle}>
                <Icon
                  name="trash"
                  color="#DC2626"
                  accessibilityLabel="삭제"
                  accessibilityRole="button"
                  testID="icon-delete"
                />
              </View>
            </Section>
          </Group>

          <Group title="Input 보완">
            <RefDemo />

            <Section title="autoCorrect / textContentType 자동 (email)">
              <Input type="email" label="이메일" placeholder="example@cokcok.com" />
              <Text style={noteStyle}>* iOS Keychain 자동완성 / 자동 교정 OFF</Text>
            </Section>

            <Section title="autoCorrect 자동 OFF (password)">
              <Input type="password" label="비밀번호" placeholder="비밀번호" />
              <Text style={noteStyle}>* 자동 교정 OFF / textContentType=&apos;password&apos; / 눈 토글 a11y 라벨</Text>
            </Section>

            <Section title="disabled 전환 시 자동 blur">
              <AutoBlurDemo />
            </Section>

            <Section title="loading (검증 중 spinner)">
              <LoadingInput label="닉네임" placeholder="중복 확인 중..." />
            </Section>

            <Section title="clearable (X 버튼으로 한 번에 비우기)">
              <ClearableDemo />
            </Section>

            <Section title="maxLength + 카운터">
              <CounterDemo />
            </Section>

            <Section title="trailingAction slot (외부 버튼)">
              <TrailingActionDemo />
            </Section>

            <Section title="error 시 alertCircle 아이콘 + helper 빨강">
              <Input label="이메일" value="invalid@" error="올바른 이메일 형식을 입력해주세요." />
            </Section>

            <Section title="shake 애니메이션 (error 켜질 때 좌우 흔들림)">
              <ShakeDemo />
            </Section>

            <Section title="a11y label/hint fallback (label → accessibilityLabel)">
              <Input label="자동 a11y label" placeholder="label이 accessibilityLabel로 자동 fallback" />
            </Section>
          </Group>

          <Section title="Navigation (페이지 이동)">
            <Button variant="text" label="로그인" onPress={() => navigation.navigate('Login')} />
            <Button variant="secondary" label="레시피 작성" onPress={() => navigation.navigate('RecipeForm')} />
            <Button variant="secondary" label="레시피 상세" onPress={() => navigation.navigate('RecipeDetail')} />
            <Button variant="primary" label="마이" onPress={() => navigation.navigate('MyPage')} />
          </Section>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: 14 }}>
      <Text style={groupTitleStyle}>{title}</Text>
      {children}
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={sectionTitleStyle}>{title}</Text>
      {children}
    </View>
  );
}

function LoadingButton({
  variant,
  label,
  fullWidth,
}: {
  variant: ButtonVariant;
  label: string;
  fullWidth?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      variant={variant}
      label={label}
      fullWidth={fullWidth}
      loading={loading}
      onPress={() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
      }}
    />
  );
}

function RefDemo() {
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  return (
    <Section title="forwardRef + onSubmitEditing 체이닝">
      <Input
        ref={emailRef}
        type="email"
        label="이메일"
        placeholder="example@cokcok.com"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <Input ref={passwordRef} type="password" label="비밀번호" placeholder="비밀번호" returnKeyType="done" />
      <Text style={noteStyle}>* 이메일 입력 후 키보드 Next 누르면 비밀번호로 focus 이동</Text>
    </Section>
  );
}

function AutoBlurDemo() {
  const [editable, setEditable] = useState(true);
  return (
    <View style={{ gap: 8 }}>
      <Input label="입력" placeholder="포커스 상태에서 비활성화 눌러보기" editable={editable} />
      <Button
        size="sm"
        variant="secondary"
        label={editable ? '비활성화' : '활성화'}
        onPress={() => setEditable((v) => !v)}
      />
    </View>
  );
}

function LoadingInput({ label, placeholder }: { label: string; placeholder: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <View style={{ gap: 8 }}>
      <Input label={label} placeholder={placeholder} loading={loading} />
      <Button
        size="sm"
        variant="secondary"
        label={loading ? '검증 중...' : '1.5초간 loading'}
        onPress={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 1500);
        }}
        disabled={loading}
      />
    </View>
  );
}

function ClearableDemo() {
  const [value, setValue] = useState('지울 수 있는 값');
  return (
    <Input
      label="clearable"
      value={value}
      onChangeText={setValue}
      placeholder="값이 있으면 우측 X 표시"
      clearable
    />
  );
}

function CounterDemo() {
  const [value, setValue] = useState('');
  return (
    <Input
      type="multiline"
      label="레시피 설명"
      placeholder="요리 설명을 입력해주세요 (최대 100자)"
      value={value}
      onChangeText={setValue}
      maxLength={100}
      showCounter
    />
  );
}

function TrailingActionDemo() {
  const [nickname, setNickname] = useState('');
  return (
    <Input
      label="닉네임"
      placeholder="닉네임"
      value={nickname}
      onChangeText={setNickname}
      trailingAction={<Button size="md" variant="secondary" label="중복 확인" onPress={noop} />}
    />
  );
}

function ShakeDemo() {
  const [hasError, setHasError] = useState(false);
  return (
    <View style={{ gap: 8 }}>
      <Input
        label="에러 토글 (켜질 때 shake)"
        placeholder="입력"
        error={hasError ? '에러가 발생했습니다.' : undefined}
        helperText={hasError ? undefined : '아래 버튼으로 에러 켜면 shake 확인'}
      />
      <Button
        size="sm"
        variant={hasError ? 'secondary' : 'danger'}
        label={hasError ? '에러 끄기' : '에러 켜기 (shake)'}
        onPress={() => setHasError((v) => !v)}
      />
    </View>
  );
}

const titleStyle = { fontSize: 20, fontWeight: '800' } as const;
const groupTitleStyle = { fontSize: 18, fontWeight: '700', color: '#FD4C06' } as const;
const sectionTitleStyle = { fontSize: 14, fontWeight: '700', color: '#374151' } as const;
const noteStyle = { fontSize: 11, color: '#9CA3AF', fontStyle: 'italic' } as const;
const iconRowStyle = { flexDirection: 'row', gap: 16, alignItems: 'center' } as const;
