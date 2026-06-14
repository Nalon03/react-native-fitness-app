import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context';

const DAILY_GOAL = 200;

const ACTIVITIES = [
  { type: 'Running', emoji: '🏃', color: '#16a34a' },
  { type: 'Walking', emoji: '🚶', color: '#0284c7' },
  { type: 'Cycling', emoji: '🚴', color: '#d97706' },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function todayLabel() {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function HomeScreen() {
  const { profile, activities } = useApp();
  const insets = useSafeAreaInsets();

  const today = new Date().toISOString().split('T')[0];
  const todayLogs = activities.filter((a) => a.date === today);
  const totalCal = todayLogs.reduce((s, a) => s + a.calories, 0);
  const totalMin = todayLogs.reduce((s, a) => s + a.duration, 0);
  const progress = Math.min(totalCal / DAILY_GOAL, 1);
  const recent = activities.slice(0, 3);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header band */}
      <View style={[styles.headerBand, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{greeting()} 👋</Text>
          <Text style={styles.dateLabel}>{todayLabel()}</Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn} onPress={() => router.push('/profile')} activeOpacity={0.75}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {/* Goal card */}
        <View style={styles.goalCard}>
          <View style={styles.goalDecorCircle} />
          <View style={styles.goalDecorCircle2} />

          <View style={styles.goalCardTop}>
            <Text style={styles.goalTitle}>Today's Goal</Text>
            <View style={styles.goalBadge}>
              <Text style={styles.goalBadgeText}>{Math.round(progress * 100)}%</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{Math.round(totalCal)}</Text>
              <Text style={styles.statLbl}>kcal</Text>
            </View>
            <View style={styles.statDot} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{totalMin}</Text>
              <Text style={styles.statLbl}>minutes</Text>
            </View>
            <View style={styles.statDot} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{todayLogs.length}</Text>
              <Text style={styles.statLbl}>sessions</Text>
            </View>
          </View>

          {progress >= 1 && (
            <View style={styles.achievedBanner}>
              <Text style={styles.achievedText}>🎉 Goal reached! Amazing work!</Text>
            </View>
          )}
        </View>

        {/* Quick log */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>QUICK LOG</Text>
          <View style={styles.quickRow}>
            {ACTIVITIES.map((a) => (
              <TouchableOpacity
                key={a.type}
                style={styles.quickChip}
                onPress={() => router.push('/(tabs)/log')}
                activeOpacity={0.75}
              >
                <Text style={styles.quickEmoji}>{a.emoji}</Text>
                <Text style={styles.quickLabel}>{a.type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>RECENT</Text>
            {activities.length > 3 && (
              <TouchableOpacity onPress={() => router.push('/(tabs)/history')} activeOpacity={0.7}>
                <Text style={styles.seeAll}>See all →</Text>
              </TouchableOpacity>
            )}
          </View>

          {recent.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🏃</Text>
              <Text style={styles.emptyTitle}>No activities yet</Text>
              <Text style={styles.emptySub}>Log your first workout to start tracking progress</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/(tabs)/log')} activeOpacity={0.8}>
                <Text style={styles.emptyBtnTxt}>+ Log Activity</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.activityList}>
              {recent.map((a, i) => {
                const meta = ACTIVITIES.find((x) => x.type === a.type);
                return (
                  <View key={a.id} style={[styles.activityItem, i === recent.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={[styles.activityDot, { backgroundColor: meta?.color ?? '#16a34a' }]} />
                    <View style={[styles.activityIconBox, { backgroundColor: (meta?.color ?? '#16a34a') + '18' }]}>
                      <Text style={styles.activityEmoji}>{meta?.emoji}</Text>
                    </View>
                    <View style={styles.activityMeta}>
                      <Text style={styles.activityType}>{a.type}</Text>
                      <Text style={styles.activitySub}>{a.duration} min · {a.date}</Text>
                    </View>
                    <Text style={[styles.activityCal, { color: meta?.color ?? '#16a34a' }]}>{a.calories} kcal</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f8fafc' },
  headerBand: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLeft: { flex: 1 },
  greeting: { fontSize: 22, fontWeight: '800', color: '#111827', letterSpacing: -0.3 },
  dateLabel: { fontSize: 13, color: '#9ca3af', marginTop: 2, fontWeight: '500' },
  avatarBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#bbf7d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 18 },

  body: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },

  goalCard: {
    backgroundColor: '#16a34a',
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  goalDecorCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -40,
    right: -30,
  },
  goalDecorCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.07)',
    bottom: -20,
    right: 60,
  },
  goalCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  goalTitle: { fontSize: 13, color: '#dcfce7', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  goalBadge: { backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  goalBadgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  progressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 3, marginBottom: 18, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: '#fff', borderRadius: 3 },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  statLbl: { fontSize: 11, color: '#bbf7d0', marginTop: 2, fontWeight: '500' },
  statDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.35)' },
  achievedBanner: {
    marginTop: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
  },
  achievedText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  section: {},
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 1, marginBottom: 10 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  seeAll: { fontSize: 12, color: '#16a34a', fontWeight: '700' },

  quickRow: { flexDirection: 'row', gap: 10 },
  quickChip: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  quickEmoji: { fontSize: 24 },
  quickLabel: { fontSize: 12, fontWeight: '700', color: '#374151' },

  activityList: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 10,
  },
  activityDot: { width: 3, height: 32, borderRadius: 2 },
  activityIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityEmoji: { fontSize: 18 },
  activityMeta: { flex: 1 },
  activityType: { fontSize: 14, fontWeight: '700', color: '#111827' },
  activitySub: { fontSize: 11, color: '#9ca3af', marginTop: 1 },
  activityCal: { fontSize: 14, fontWeight: '800' },

  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emptyEmoji: { fontSize: 38, marginBottom: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 5 },
  emptySub: { fontSize: 13, color: '#9ca3af', textAlign: 'center', lineHeight: 19, marginBottom: 18 },
  emptyBtn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 10,
  },
  emptyBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
