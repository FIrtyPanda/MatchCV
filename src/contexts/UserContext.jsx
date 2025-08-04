import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // 🔥 Tambahan penting
  const [history, setHistory] = useState([]);

  // Ambil data user
  const fetchUser = useCallback(async () => {
    setLoadingUser(true); // mulai loading
    try {
      const res = await axios.get('http://localhost:8000/auth/me', {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoadingUser(false); // selesai loading
    }
  }, []);

  // Ambil riwayat upload user
  const fetchHistory = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get('http://localhost:8000/cv/my-uploads', {
        withCredentials: true,
      });
      setHistory(res.data);
    } catch (err) {
      console.error('[Fetch History Error]', err);
    }
  }, [user]);

  // Jalankan saat pertama kali aplikasi dimuat
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Ambil riwayat ketika user sudah login
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Pantau event 'cvUploaded' untuk refresh history
  useEffect(() => {
    const handleUpload = () => {
      fetchHistory();
    };

    window.addEventListener('cvUploaded', handleUpload);
    return () => {
      window.removeEventListener('cvUploaded', handleUpload);
    };
  }, [fetchHistory]);

  return (
    <UserContext.Provider
      value={{ user, setUser, history, setHistory, fetchUser, fetchHistory, loadingUser }}
    >
      {children}
    </UserContext.Provider>
  );
};