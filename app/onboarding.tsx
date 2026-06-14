import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from './context';

type FormState = { age: string; weight: string; height: string };
type FormErrors = Partial<FormState>;

const FIELDS = [
  { key: 'age' as const, label: 'Age', unit: 'years', placeholder: 'e.g. 20', min: 5, max: 120 },
  { key: 'weight' as const, label: 'Weight', unit: 'kg', placeholder: 'e.g. 65', min: 20, max: 300 },
  { key: 'height' as const, label: 'Height', unit: 'cm', placeholder: 'e.g. 170', min: 50, max: 250 },
];

export default function OnboardingScreen() {
  const { setProfile } = useApp();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<FormState>({ age: '', weight: '', height: '' });
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): FormErrors {
    const e: FormErrors = {};
    FIELDS.forEach(({ key, label, min, max }) => {
      const val = parseFloat(form[key]);
      if (!form[key].trim()) e[key] = `${label} is required`;
      else if (isNaN(val) || val < min || val > max)
        e[key] = `Enter a valid ${label.toLowerCase()} (${min}–${max})`;
    });
    return e;
  }

  function handleStart() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setProfile(form);
    router.replace('/(tabs)');
  }

  function updateField(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, { paddingTop: insets.top }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.step}>Step 1 of 1</Text>
          <Text style={styles.appName}>Create Your Profile</Text>
          <Text style={styles.appTagline}>Used to calculate calories burned accurately</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formHeading}>Personal Information</Text>
          <Text style={styles.formSub}>
            Enter your age, weight and height. You can update these at any time from your profile.
          </Text>

          {FIELDS.map(({ key, label, unit, placeholder }) => (
            <View key={key} style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <Text style={styles.fieldUnit}>{unit}</Text>
              </View>
              <TextInput
                style={[styles.input, !!errors[key] && styles.inputError]}
                placeholder={placeholder}
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                returnKeyType="next"
                value={form[key]}
                onChangeText={(v) => updateField(key, v)}
              />
              {errors[key] ? (
                <View style={styles.errorRow}>
                  <Text style={styles.errorDot}>●</Text>
                  <Text style={styles.errorText}>{errors[key]}</Text>
                </View>
              ) : null}
            </View>
          ))}

          <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.85}>
            <Text style={styles.startBtnText}>Get Started</Text>
          </TouchableOpacity>

          <Text style={styles.footnote}>
            Your data is stored only on this device and used solely to calculate fitness metrics.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { flex: 1 },
  container: { paddingBottom: 40 },
  hero: {
    backgroundColor: '#16a34a',
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 24,
  },
  step: { fontSize: 12, color: '#bbf7d0', fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 },
  appName: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 8 },
  appTagline: { fontSize: 14, color: '#dcfce7', textAlign: 'center', lineHeight: 20 },
  formSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  formHeading: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 8 },
  formSub: { fontSize: 14, color: '#6b7280', lineHeight: 21, marginBottom: 28 },
  fieldGroup: { marginBottom: 20 },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: { fontSize: 14, fontWeight: '700', color: '#374151' },
  fieldUnit: { fontSize: 12, color: '#9ca3af', fontWeight: '500' },
  input: {
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  inputError: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  errorDot: { fontSize: 6, color: '#ef4444' },
  errorText: { fontSize: 12, color: '#ef4444', fontWeight: '500' },
  startBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  startBtnText: { color: '#fff', fontWeight: '700', fontSize: 17 },
  footnote: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
});
