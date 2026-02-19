// Compatibility wrapper: replace Supabase client with Firebase equivalents.
// This keeps import paths intact for parts of the app that might reference
// `@/integrations/supabase/client` while using Firebase services under the hood.

import { app } from '../../firebaseConfig.js';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseAuth = getAuth(app);
export const firebaseDb = getFirestore(app);
export const firebaseStorage = getStorage(app);

// Provide a minimal `supabase`-named wrapper so existing imports don't break.
export const supabase = {
  app,
  auth: firebaseAuth,
  db: firebaseDb,
  storage: firebaseStorage,
};