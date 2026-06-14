import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context';

const ACTIVITIES = [
  { type: 'Running' as const, emoji: '🏃', met: 9.8, desc: 'High intensity · Best calorie burn' },
  { type: 'Walking' as const, emoji: '🚶', met: 3.5, desc: 'Low intensity · Great for beginners' },
  { type: 'Cycling' as const, emoji: '🚴', met: 7.5, desc: 'Medium intensity · Joint-friendly' },
];

const CALORIE_GOAL = 200;

export default function LogScreen() {
  const { profile, activities, addActivity, showToast } = useApp();
  const insets = useSafeAreaInsets();

  const [selected, setSelected] = useState<string | null>(null);
  const [duration, setDuration] = useState(30);

  const weight = parseFloat(profile?.weight ?? '0');
  const activity = ACTIVITIES.find((a) => a.type === selected);
  const calories = activity && weight > 0 ? Math.round(activity.met * weight * (duration / 60)) : 0;

  function adjustDuration(delta: number) {
    setDuration((d) => Math.max(1, Math.min(180, d + delta)));
  }

  function handleLog() {
    if (!selected) {
      showToast('Please select an activity', 'error');
      return;
    }
    if (duration <= 0) {
      showToast('Enter a valid duration', 'error');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    addActivity({
      id: String(Date.now()),
      type: selected as 'Running' | 'Walking' | 'Cycling',
      duration,
      calories,
      date: today,
    });

    const todayTotal = activities
      .filter((a) => a.date === today)
      .reduce((s, a) => s + a.calories, 0) + calories;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (todayTotal >= CALORIE_GOAL) {
      showToast(`🎉 Goal reached! ${todayTotal} kcal burned today!`);
    } else {
      showToast(`Logged! ${calories} kcal burned`);
    }

    setSelected(null);
    setDuration(30);
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 20 }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.pageTitle}>Log Activity</Text>
      <Text style={styles.pageSub}>Select an activity and set duration</Text>

      <Text style={styles.sectionLabel}>Choose Activity</Text>
      {ACTIVITIES.map((a) => {
        const isSelected = selected === a.type;
        return (
          <TouchableOpacity
            key={a.type}
            style={[styles.activityCard, isSelected && styles.activityCardSelected]}
            onPress={() => setSelected(a.type)}
            activeOpacity={0.75}
          >
            <Text style={styles.activityEmoji}>{a.emoji}</Text>
            <View style={styles.activityCardBody}>
              <Text style={[styles.activityCardTitle, isSelected && styles.textWhite]}>{a.type}</Text>
              <Text style={[styles.activityCardDesc, isSelected && styles.textWhiteLight]}>{a.desc}</Text>
            </View>
            <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        );
      })}

      <Text style={styles.sectionLabel}>Duration</Text>
      <View style={styles.durationCard}>
        <TouchableOpacity style={styles.durationBtn} onPress={() => adjustDuration(-5)} activeOpacity={0.7}>
          <Text style={styles.durationBtnText}>−</Text>
        </TouchableOpacity>
        <View style={styles.durationCenter}>
          <TextInput
            style={styles.durationInput}
            keyboardType="numeric"
            value={String(duration)}
            onChangeText={(v) => {
              const n = parseInt(v, 10);
              if (!isNaN(n)) setDuration(Math.max(1, Math.min(180, n)));
            }}
            selectTextOnFocus
          />
          <Text style={styles.durationUnit}>minutes</Text>
        </View>
        <TouchableOpacity style={styles.durationBtn} onPress={() => adjustDuration(5)} activeOpacity={0.7}>
          <Text style={styles.durationBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {calories > 0 && (
        <View style={styles.caloriePreview}>
          <Text style={styles.caloriePreviewLabel}>Estimated Calories Burned</Text>
          <Text style={styles.caloriePreviewNum}>{calories}</Text>
          <Text style={styles.caloriePreviewUnit}>kcal</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.logBtn, (!selected || calories === 0) && styles.logBtnDisabled]}
        onPress={handleLog}
        activeOpacity={0.8}
        disabled={!selected}
      >
        <Text style={styles.logBtnText}>Save Activity</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f8fafc' },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 4 },
  pageSub: { fontSize: 13, color: '#6b7280', marginBottom: 24 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#6b7280', letterSpacing: 0.5, marginBottom: 10, textTransform: 'uppercase' },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    gap: 14,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  activityCardSelected: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  activityEmoji: { fontSize: 30 },
  activityCardBody: { flex: 1 },
  activityCardTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  activityCardDesc: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  textWhite: { color: '#fff' },
  textWhiteLight: { color: '#dcfce7' },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: '#fff' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  durationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  durationBtn: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBtnText: { fontSize: 26, color: '#16a34a', fontWeight: '600', lineHeight: 30 },
  durationCenter: { flex: 1, alignItems: 'center' },
  durationInput: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    paddingVertical: 4,
    minWidth: 60,
  },
  durationUnit: { fontSize: 13, color: '#6b7280', marginTop: -4 },
  caloriePreview: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  caloriePreviewLabel: { fontSize: 12, color: '#15803d', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  caloriePreviewNum: { fontSize: 52, fontWeight: '800', color: '#16a34a', lineHeight: 60 },
  caloriePreviewUnit: { fontSize: 16, color: '#15803d', fontWeight: '600' },
  caloriePreviewNote: { fontSize: 12, color: '#b45309', marginTop: 8, textAlign: 'center' },
  logBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logBtnDisabled: { backgroundColor: '#d1d5db', shadowOpacity: 0 },
  logBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
