import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-emerald-100 py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} ইফতারি খাইতাইনি। সর্বস্বত্ব সংরক্ষিত।</p>
        <p className="text-sm mt-2 opacity-75">সিলেটের মানুষের জন্য একটি ক্ষুদ্র প্রয়াস।</p>
        <p className="text-xs mt-4 text-emerald-300/60">Developer by Abdul Aziz Ahmed</p>
      </div>
    </footer>
  );
}
