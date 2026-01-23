import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig.js';
import { ManageAccount } from '../config/firebaseConnect.js';
import supabase from '../config/supabaseClient.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Obtener datos adicionales del usuario
        const account = new ManageAccount();
        const data = await account.getUserData(firebaseUser.uid);
        setUserData(data);

        // Verificar y crear usuario en Supabase si no existe
        try {
          const { data: supabaseUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('uid', firebaseUser.uid)
            .single();

          if (fetchError && fetchError.code === 'PGRST116') {
            // Usuario no existe en Supabase, crearlo
            const nameParts = (data?.name || data?.nickname || firebaseUser.email?.split('@')[0] || '').trim().split(' ');
            const firstName = nameParts[0] || data?.nickname || firebaseUser.email?.split('@')[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            const { error: insertError } = await supabase
              .from('users')
              .insert([{
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                username: data?.nickname || firebaseUser.email?.split('@')[0] || '',
                first_name: firstName,
                last_name: lastName
              }]);

            if (insertError) {
              console.error('Error creating user in Supabase:', insertError);
            }
          }
        } catch (err) {
          console.error('Error checking/creating user in Supabase:', err);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userData,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
