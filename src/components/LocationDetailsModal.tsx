import React, { useState } from 'react';
import { IftarLocation, Comment } from '../types';
import { X, ThumbsUp, ThumbsDown, Send, User } from 'lucide-react';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

interface LocationDetailsModalProps {
  location: IftarLocation;
  onClose: () => void;
}

export default function LocationDetailsModal({ location, onClose }: LocationDetailsModalProps) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (type: 'true' | 'fake') => {
    try {
      const ref = doc(db, 'locations', location.id!);
      await updateDoc(ref, {
        [`votes.${type}`]: increment(1)
      });
      toast.success('ভোট গ্রহণ করা হয়েছে');
    } catch (error) {
      console.error(error);
      toast.error('ভোট দিতে সমস্যা হয়েছে');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const newComment: Comment = {
        userName: 'Anonymous User', // In a real app, use auth user
        text: commentText,
        timestamp: new Date()
      };

      const ref = doc(db, 'locations', location.id!);
      await updateDoc(ref, {
        comments: arrayUnion(newComment)
      });
      
      setCommentText('');
      toast.success('মন্তব্য যোগ করা হয়েছে');
    } catch (error) {
      console.error(error);
      toast.error('মন্তব্য করতে সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-emerald-50">
          <h3 className="font-bold text-lg text-emerald-900 truncate pr-4">{location.name}</h3>
          <button onClick={onClose} className="p-1 hover:bg-emerald-100 rounded-full transition-colors text-emerald-700">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto">
          {location.imageUrl && (
            <img src={location.imageUrl} alt={location.name} className="w-full h-48 object-cover rounded-xl mb-4" />
          )}

          <div className="space-y-3 text-sm text-gray-700">
            <p><span className="font-semibold">ঠিকানা:</span> {location.address}</p>
            <p><span className="font-semibold">মেনু:</span> {location.menu}</p>
            <p><span className="font-semibold">সময়:</span> {location.time}</p>
            <p><span className="font-semibold">যোগাযোগ:</span> {location.contact}</p>
          </div>

          {/* Voting */}
          <div className="mt-6 flex gap-4">
            <button 
              onClick={() => handleVote('true')}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 rounded-lg transition-colors border border-emerald-200"
            >
              <ThumbsUp size={18} /> সত্য ({location.votes.true})
            </button>
            <button 
              onClick={() => handleVote('fake')}
              className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded-lg transition-colors border border-red-200"
            >
              <ThumbsDown size={18} /> ভুয়া ({location.votes.fake})
            </button>
          </div>

          {/* Comments Section */}
          <div className="mt-8">
            <h4 className="font-bold text-gray-800 mb-3">মন্তব্য ({location.comments?.length || 0})</h4>
            
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2">
              {location.comments && location.comments.length > 0 ? (
                location.comments.map((comment, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <User size={12} className="text-gray-400" />
                      <span className="font-semibold text-gray-700">{comment.userName}</span>
                    </div>
                    <p className="text-gray-600">{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic">কোন মন্তব্য নেই</p>
              )}
            </div>

            <form onSubmit={handleComment} className="relative">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="আপনার মন্তব্য লিখুন..."
                className="w-full pl-4 pr-10 py-2 border rounded-full text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <button 
                type="submit" 
                disabled={isSubmitting || !commentText.trim()}
                className="absolute right-1 top-1 p-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
