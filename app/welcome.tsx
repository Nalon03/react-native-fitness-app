import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FEATURES = [
  { emoji: '🏃', text: 'Log running, walking & cycling' },
  { emoji: '🔥', text: 'Calculate calories burned accurately' },
  { emoji: '📊', text: 'Track daily, weekly & monthly progress' },
];

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <View style={[styles.hero, { paddingTop: insets.top + 48 }]}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>🏃</Text>
        </View>
        <Text style={styles.appName}>Health & Fitness</Text>
        <Text style={styles.appTagline}>Your personal fitness companion</Text>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 32 }]}>
        <Text style={styles.bottomHeading}>What you can do</Text>
        {FEATURES.map((f) => (
          <View key={f.text} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
            </View>
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push('/onboarding')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  hero: {
    backgroundColor: '#16a34a',
    alignItems: 'center',
    paddingBottom: 52,
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconEmoji: { fontSize: 52 },
  appName: { fontSize: 30, fontWeight: '800', color: '#fff', marginBottom: 10 },
  appTagline: { fontSize: 15, color: '#dcfce7', textAlign: 'center' },
  bottom: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
    justifyContent: 'space-between',
  },
  bottomHeading: { fontSize: 13, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 20 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureEmoji: { fontSize: 22 },
  featureText: { fontSize: 15, color: '#374151', fontWeight: '500', flex: 1 },
  btn: {
    backgroundColor: '#16a34a',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 17 },
});
