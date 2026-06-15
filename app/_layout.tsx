import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { CelebrationModal } from '@/components/CelebrationModal';
import { Toast } from '@/components/Toast';
import { AppProvider, useApp } from './context';

function NavigationGuard() {
  const { profile, loaded } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!loaded) return;
    const guestScreens = ['welcome', 'onboarding'];
    const onGuestScreen = guestScreens.includes(segments[0] as string);
    if (!profile && !onGuestScreen) {
      router.replace('/welcome');
    } else if (profile && onGuestScreen) {
      router.replace('/(tabs)');
    }
  }, [loaded, profile, segments]);

  return null;
}

function LoadingOverlay() {
  const { loaded } = useApp();
  if (loaded) return null;
  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator color="#16a34a" size="large" />
    </View>
  );
}

function GlobalToast() {
  const { toast } = useApp();
  return (
    <Toast message={toast?.message ?? ''} type={toast?.type ?? 'success'} visible={!!toast} />
  );
}

function GlobalCelebration() {
  const { celebration, hideCelebration } = useApp();
  return (
    <CelebrationModal
      visible={celebration !== null}
      calories={celebration ?? 0}
      onClose={hideCelebration}
    />
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <ThemeProvider value={DefaultTheme}>
        <NavigationGuard />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen
            name="profile"
            options={{
              title: 'Edit Profile',
              headerTintColor: '#16a34a',
              headerShadowVisible: false,
              headerStyle: { backgroundColor: '#f8fafc' },
            }}
          />
        </Stack>
        <LoadingOverlay />
        <GlobalToast />
        <GlobalCelebration />
        <StatusBar style="dark" />
      </ThemeProvider>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
});
