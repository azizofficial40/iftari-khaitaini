import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { IftarLocation } from '../types';

// Mock data for fallback
const MOCK_LOCATIONS: IftarLocation[] = [
  {
    id: '1',
    name: 'শাহজালাল মাজার মসজিদ',
    category: 'mosque',
    district: 'sylhet',
    address: 'দরগাহ গেইট, সিলেট',
    lat: 24.8993,
    lng: 91.8700,
    menu: 'খিচুড়ি, ছোলা, খেজুর, শরবত',
    time: '৫:৪৫ PM',
    contact: '01711000000',
    verificationStatus: 'verified',
    votes: { true: 150, fake: 2 },
    comments: [],
    isApproved: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'বন্দর বাজার জামে মসজিদ',
    category: 'mosque',
    district: 'sylhet',
    address: 'বন্দর বাজার, সিলেট',
    lat: 24.8950,
    lng: 91.8680,
    menu: 'বিরিয়ানি প্যাকেট',
    time: '৫:৫০ PM',
    contact: '01811000000',
    verificationStatus: 'verified',
    votes: { true: 85, fake: 0 },
    comments: [],
    isApproved: true,
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'মানবসেবা সংগঠন',
    category: 'organization',
    district: 'sunamganj',
    address: 'ট্রাফিক পয়েন্ট, সুনামগঞ্জ',
    lat: 25.0662,
    lng: 91.4072,
    menu: 'প্যাকেট ইফতার',
    time: '৫:৪০ PM',
    contact: '01911000000',
    verificationStatus: 'unverified',
    votes: { true: 12, fake: 1 },
    comments: [],
    isApproved: true,
    createdAt: new Date(),
  }
];

export function useLocations() {
  const [locations, setLocations] = useState<IftarLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const q = query(collection(db, 'locations'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const locs: IftarLocation[] = [];
        snapshot.forEach((doc) => {
          locs.push({ id: doc.id, ...doc.data() } as IftarLocation);
        });
        setLocations(locs);
        setLoading(false);
      }, (err) => {
        console.error('Firebase error:', err);
        setError('Failed to fetch data');
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Firebase init error:', err);
      setLocations(MOCK_LOCATIONS);
      setLoading(false);
    }
  }, []);

  return { locations, loading, error };
}
