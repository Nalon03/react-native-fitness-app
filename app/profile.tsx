import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from './context';

type FormState = { age: string; weight: string; height: string };
type FormErrors = Partial<FormState>;

const FIELDS = [
  { key: 'age' as const, label: 'Age', unit: 'years', placeholder: 'e.g. 20', min: 5, max: 120 },
  { key: 'weight' as const, label: 'Weight', unit: 'kg', placeholder: 'e.g. 65', min: 20, max: 300 },
  { key: 'height' as const, label: 'Height', unit: 'cm', placeholder: 'e.g. 170', min: 50, max: 250 },
];

function ConfirmModal({
  visible,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.dialog} onPress={() => {}}>
          <View style={styles.dialogIconWrap}>
            <Text style={styles.dialogIcon}>⚠️</Text>
          </View>
          <Text style={styles.dialogTitle}>Reset App Data?</Text>
          <Text style={styles.dialogMsg}>
            This will permanently clear your profile and all activity history. You will be taken back to the welcome screen.
          </Text>
          <View style={styles.dialogBtns}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.75}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm} activeOpacity={0.8}>
              <Text style={styles.confirmBtnText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function ProfileScreen() {
  const { profile, setProfile, showToast, logout } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);

  const initial = useRef<FormState>({
    age: profile?.age ?? '',
    weight: profile?.weight ?? '',
    height: profile?.height ?? '',
  });

  const [form, setForm] = useState<FormState>({ ...initial.current });
  const [errors, setErrors] = useState<FormErrors>({});

  const isDirty = FIELDS.some(({ key }) => form[key].trim() !== initial.current[key].trim());

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

  function handleSave() {
    if (!isDirty) return;
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      showToast('Please fix the errors below', 'error');
      return;
    }
    setErrors({});
    setProfile(form);
    initial.current = { ...form };
    showToast('Profile updated successfully');
    router.back();
  }

  function updateField(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleConfirmLogout() {
    setShowConfirm(false);
    logout();
    router.replace('/welcome');
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ConfirmModal
        visible={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirmLogout}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarWrap}>
          <Text style={styles.avatar}>👤</Text>
        </View>
        <Text style={styles.pageTitle}>Personal Information</Text>
        <Text style={styles.pageSub}>
          Your data is used only to calculate calories burned during activities
        </Text>

        <View style={styles.formCard}>
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
        </View>

        <View style={styles.currentCard}>
          <Text style={styles.currentTitle}>Saved Values</Text>
          <View style={styles.currentRow}>
            {FIELDS.map(({ key, label, unit }, i) => (
              <View key={key} style={styles.currentItem}>
                {i > 0 && <View style={styles.currentDivider} />}
                <View style={styles.currentContent}>
                  <Text style={styles.currentNum}>{profile?.[key] ?? '—'}</Text>
                  <Text style={styles.currentLbl}>{label} ({unit})</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, !isDirty && styles.saveBtnDisabled]}
          onPress={handleSave}
          activeOpacity={isDirty ? 0.8 : 1}
          disabled={!isDirty}
        >
          <Text style={[styles.saveBtnText, !isDirty && styles.saveBtnTextDisabled]}>
            {isDirty ? 'Save Changes' : 'No Changes to Save'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => setShowConfirm(true)} activeOpacity={0.8}>
          <Text style={styles.logoutBtnText}>Reset App & Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { flex: 1 },
  container: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 20 },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  avatar: { fontSize: 36 },
  pageTitle: { fontSize: 22, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  pageSub: { fontSize: 13, color: '#6b7280', textAlign: 'center', marginBottom: 24, lineHeight: 19 },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldGroup: { marginBottom: 16 },
  fieldLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  fieldLabel: { fontSize: 14, fontWeight: '700', color: '#374151' },
  fieldUnit: { fontSize: 12, color: '#9ca3af', fontWeight: '500' },
  input: {
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  inputError: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  errorDot: { fontSize: 6, color: '#ef4444' },
  errorText: { fontSize: 12, color: '#ef4444', fontWeight: '500' },
  currentCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  currentTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  currentRow: { flexDirection: 'row', alignItems: 'center' },
  currentItem: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  currentDivider: { width: 1, height: 32, backgroundColor: '#bbf7d0', marginRight: 12 },
  currentContent: { flex: 1, alignItems: 'center' },
  currentNum: { fontSize: 20, fontWeight: '800', color: '#16a34a' },
  currentLbl: { fontSize: 11, color: '#6b7280', marginTop: 2, textAlign: 'center' },
  saveBtn: {
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
  saveBtnDisabled: { backgroundColor: '#f3f4f6', shadowOpacity: 0, elevation: 0 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  saveBtnTextDisabled: { color: '#9ca3af' },
  logoutBtn: {
    marginTop: 12,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fca5a5',
    backgroundColor: '#fff5f5',
  },
  logoutBtnText: { color: '#ef4444', fontWeight: '700', fontSize: 15 },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  dialogIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  dialogIcon: { fontSize: 26 },
  dialogTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8 },
  dialogMsg: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 21, marginBottom: 24 },
  dialogBtns: { flexDirection: 'row', gap: 10, width: '100%' },
  cancelBtn: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  cancelBtnText: { color: '#374151', fontWeight: '700', fontSize: 15 },
  confirmBtn: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#ef4444',
  },
  confirmBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
