import { useAudioPlayer } from 'expo-audio';
import { useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  calories: number;
  onClose: () => void;
};

export function CelebrationModal({ visible, calories, onClose }: Props) {
  const player = useAudioPlayer(require('../assets/sounds/applause.wav'));

  useEffect(() => {
    if (visible) {
      player.seekTo(0);
      player.play();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.starsRow}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.star}>🌟</Text>
            <Text style={styles.star}>⭐</Text>
          </View>
          <Text style={styles.trophy}>🏆</Text>
          <Text style={styles.title}>Goal Reached!</Text>
          <Text style={styles.sub}>You burned</Text>
          <View style={styles.calRow}>
            <Text style={styles.calNum}>{calories}</Text>
            <Text style={styles.calUnit}>kcal</Text>
          </View>
          <Text style={styles.sub}>today — amazing work!</Text>
          <View style={styles.sparkleRow}>
            <Text style={styles.sparkle}>✨</Text>
            <Text style={styles.sparkle}>🎉</Text>
            <Text style={styles.sparkle}>✨</Text>
          </View>
          <TouchableOpacity style={styles.btn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.btnText}>Keep it up!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  star: { fontSize: 22 },
  trophy: { fontSize: 72, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 8 },
  sub: { fontSize: 15, color: '#6b7280', fontWeight: '500' },
  calRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginVertical: 4 },
  calNum: { fontSize: 52, fontWeight: '800', color: '#16a34a', lineHeight: 58 },
  calUnit: { fontSize: 18, fontWeight: '700', color: '#16a34a', marginBottom: 8 },
  sparkleRow: { flexDirection: 'row', gap: 8, marginVertical: 16 },
  sparkle: { fontSize: 24 },
  btn: {
    backgroundColor: '#16a34a',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
