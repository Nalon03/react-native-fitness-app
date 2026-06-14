import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

export type Profile = { age: string; weight: string; height: string };
export type ActivityLog = {
  id: string;
  type: 'Running' | 'Walking' | 'Cycling';
  duration: number;
  calories: number;
  date: string;
};
export type ToastData = { message: string; type: 'success' | 'error' } | null;

type Ctx = {
  profile: Profile | null;
  setProfile: (p: Profile) => void;
  activities: ActivityLog[];
  addActivity: (a: ActivityLog) => void;
  toast: ToastData;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  loaded: boolean;
  logout: () => void;
};

const AppContext = createContext<Ctx>({
  profile: null, setProfile: () => {}, activities: [],
  addActivity: () => {}, toast: null, showToast: () => {}, loaded: false, logout: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [toast, setToast] = useState<ToastData>(null);
  const [loaded, setLoaded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AsyncStorage.multiGet(['@profile', '@activities'])
      .then(([p, a]) => {
        if (p[1]) setProfileState(JSON.parse(p[1]));
        if (a[1]) setActivities(JSON.parse(a[1]));
      })
      .finally(() => setLoaded(true));
  }, []);

  function setProfile(p: Profile) {
    setProfileState(p);
    AsyncStorage.setItem('@profile', JSON.stringify(p));
  }

  function addActivity(a: ActivityLog) {
    setActivities((prev) => {
      const next = [a, ...prev];
      AsyncStorage.setItem('@activities', JSON.stringify(next));
      return next;
    });
  }

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message: msg, type });
    timer.current = setTimeout(() => setToast(null), 3000);
  }

  function logout() {
    AsyncStorage.multiRemove(['@profile', '@activities']);
    setProfileState(null);
    setActivities([]);
  }

  return (
    <AppContext.Provider value={{ profile, setProfile, activities, addActivity, toast, showToast, loaded, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
