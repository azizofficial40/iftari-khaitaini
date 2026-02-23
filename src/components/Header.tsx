import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function Header() {
  const { isInstallable, install } = usePWAInstall();

  return (
    <header className="bg-emerald-900/95 backdrop-blur-sm text-white shadow-lg sticky top-0 z-50 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-emerald-800 p-2 rounded-full group-hover:bg-emerald-700 transition-colors">
            <Moon className="w-6 h-6 text-yellow-400 fill-current" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold leading-tight tracking-tight">ইফতারি খাইতাইনি</h1>
            <p className="text-[10px] md:text-xs text-emerald-200 font-medium">সিলেট বিভাগের ইফতার ম্যাপ</p>
          </div>
        </Link>
        <nav className="flex items-center gap-3">
          {isInstallable && (
            <button 
              onClick={install}
              className="hidden md:flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 px-3 py-1.5 rounded-full text-xs transition-colors border border-emerald-700"
            >
              <Download size={14} />
              অ্যাপ ইনস্টল করুন
            </button>
          )}
          <Link 
            to="/add" 
            className="bg-yellow-500 hover:bg-yellow-400 text-emerald-950 font-bold py-2 px-4 md:px-6 rounded-full text-xs md:text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            নতুন তথ্য দিন
          </Link>
        </nav>
      </div>
    </header>
  );
}
