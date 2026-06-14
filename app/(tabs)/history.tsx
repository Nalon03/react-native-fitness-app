import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context';

type Period = 'Daily' | 'Weekly' | 'Monthly';

const PERIODS: Period[] = ['Daily', 'Weekly', 'Monthly'];
const PERIOD_DAYS: Record<Period, number> = { Daily: 1, Weekly: 7, Monthly: 30 };

const ACTIVITY_EMOJI: Record<string, string> = {
  Running: '🏃',
  Walking: '🚶',
  Cycling: '🚴',
};

const ACTIVITY_COLOR: Record<string, string> = {
  Running: '#16a34a',
  Walking: '#0284c7',
  Cycling: '#d97706',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function HistoryScreen() {
  const { activities } = useApp();
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<Period>('Daily');

  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(today.getDate() - (PERIOD_DAYS[period] - 1));
  const cutoffStr = cutoff.toISOString().split('T')[0];

  const filtered = activities.filter((a) => a.date >= cutoffStr);
  const totalCal = filtered.reduce((s, a) => s + a.calories, 0);
  const totalMin = filtered.reduce((s, a) => s + a.duration, 0);
  const maxCal = filtered.length > 0 ? Math.max(...filtered.map((a) => a.calories)) : 1;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 20 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>History</Text>
      <Text style={styles.pageSub}>Your workout records</Text>

      <View style={styles.periodRow}>
        {PERIODS.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodBtn, period === p && styles.periodBtnActive]}
            onPress={() => setPeriod(p)}
            activeOpacity={0.7}
          >
            <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNum}>{Math.round(totalCal)}</Text>
          <Text style={styles.summaryLbl}>Total kcal</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNum}>{totalMin}</Text>
          <Text style={styles.summaryLbl}>Total min</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNum}>{filtered.length}</Text>
          <Text style={styles.summaryLbl}>Sessions</Text>
        </View>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyTitle}>No data for this period</Text>
          <Text style={styles.emptySub}>Log activities to see your history here</Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionLabel}>Activity Log</Text>
          {filtered.map((a) => {
            const barWidth = maxCal > 0 ? (a.calories / maxCal) * 100 : 0;
            const color = ACTIVITY_COLOR[a.type] ?? '#16a34a';
            return (
              <View key={a.id} style={styles.logCard}>
                <View style={styles.logCardTop}>
                  <View style={styles.logLeft}>
                    <View style={[styles.logIcon, { backgroundColor: color + '1a' }]}>
                      <Text style={styles.logEmoji}>{ACTIVITY_EMOJI[a.type]}</Text>
                    </View>
                    <View>
                      <Text style={styles.logType}>{a.type}</Text>
                      <Text style={styles.logDate}>{formatDate(a.date)} · {a.duration} min</Text>
                    </View>
                  </View>
                  <Text style={[styles.logCal, { color }]}>{a.calories} kcal</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${barWidth}%` as any, backgroundColor: color }]} />
                </View>
              </View>
            );
          })}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f8fafc' },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 4 },
  pageSub: { fontSize: 13, color: '#6b7280', marginBottom: 20 },
  periodRow: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
  },
  periodBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  periodText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  periodTextActive: { color: '#16a34a' },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryNum: { fontSize: 22, fontWeight: '800', color: '#16a34a' },
  summaryLbl: { fontSize: 11, color: '#6b7280', marginTop: 4, fontWeight: '500' },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#6b7280', letterSpacing: 0.5, marginBottom: 10, textTransform: 'uppercase' },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 36,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyEmoji: { fontSize: 42, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 6 },
  emptySub: { fontSize: 13, color: '#6b7280', textAlign: 'center' },
  logCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  logCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  logLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logEmoji: { fontSize: 20 },
  logType: { fontSize: 15, fontWeight: '700', color: '#111827' },
  logDate: { fontSize: 12, color: '#6b7280', marginTop: 1 },
  logCal: { fontSize: 16, fontWeight: '800' },
  barTrack: { height: 5, backgroundColor: '#f3f4f6', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 5, borderRadius: 3 },
});
