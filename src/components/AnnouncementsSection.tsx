'use client';

import React, { useState } from 'react';
import { 
  Megaphone, 
  Pin, 
  Search, 
  Calendar, 
  User, 
  Share2, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  Users, 
  FileText,
  ChevronRight
} from 'lucide-react';
import { Announcement } from '@/lib/types';

interface AnnouncementsSectionProps {
  announcements: Announcement[];
}

export function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'urgent' | 'liturgy' | 'society' | 'general'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<Announcement | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Category badge helper
  const getCategoryDetails = (category: Announcement['category']) => {
    switch (category) {
      case 'urgent':
        return { label: 'Urgent Notice', bg: 'bg-red-50 text-red-700 border-red-200', icon: AlertTriangle };
      case 'liturgy':
        return { label: 'Liturgy & Feast', bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: Sparkles };
      case 'society':
        return { label: 'Societies & Youth', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Users };
      default:
        return { label: 'General Announcement', bg: 'bg-stone-100 text-stone-700 border-stone-200', icon: Megaphone };
    }
  };

  const filtered = announcements.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyShare = (item: Announcement, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `*${item.title}*\n${item.content}\n\nSt. Anthony Catholic Church Bulletin`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Search & Category Filter */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Notices' },
              { id: 'urgent', label: 'Urgent' },
              { id: 'liturgy', label: 'Liturgy' },
              { id: 'society', label: 'Societies' },
              { id: 'general', label: 'General' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-amber-900 text-amber-50 shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const cat = getCategoryDetails(item.category);
            const CatIcon = cat.icon;
            return (
              <div
                key={item.id}
                onClick={() => setExpandedAnnouncement(item)}
                className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all cursor-pointer hover:shadow-sm ${
                  item.isPinned 
                    ? 'border-amber-300 ring-1 ring-amber-400/20' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.isPinned && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-900 text-amber-100 shadow-xs">
                        <Pin className="w-3 h-3 rotate-45" />
                        <span>Pinned</span>
                      </span>
                    )}

                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cat.bg}`}>
                      <CatIcon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => handleCopyShare(item, e)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                      title="Share Announcement"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 mt-2.5 leading-snug">
                  {item.title}
                </h3>

                <p className="font-serif text-stone-600 text-sm sm:text-base mt-2 line-clamp-3 leading-relaxed">
                  {item.content}
                </p>

                <div className="flex items-center justify-between text-xs text-stone-400 pt-4 mt-4 border-t border-stone-100 font-sans">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5" />
                      <span className="text-stone-600 font-medium">{item.author}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </span>
                  </div>
                  <span className="text-amber-800 font-semibold flex items-center space-x-0.5 group">
                    <span>Read More</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
            <Megaphone className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-stone-700">No Announcements Found</h3>
            <p className="text-xs text-stone-500 mt-1">There are no notices matching your current filter.</p>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {expandedAnnouncement && (
        <div 
          onClick={() => setExpandedAnnouncement(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Parish Announcement
              </span>
              <button
                onClick={() => setExpandedAnnouncement(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold"
              >
                Close ✕
              </button>
            </div>

            <div>
              <h2 className="font-serif font-bold text-2xl text-stone-900 leading-snug">
                {expandedAnnouncement.title}
              </h2>
              <div className="flex items-center space-x-3 text-xs text-stone-500 mt-2 font-sans">
                <span>By: <strong>{expandedAnnouncement.author}</strong></span>
                <span>•</span>
                <span>{new Date(expandedAnnouncement.publishedAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="font-serif text-stone-800 text-base sm:text-lg leading-relaxed whitespace-pre-line bg-stone-50 p-5 rounded-2xl border border-stone-100">
              {expandedAnnouncement.content}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={(e) => handleCopyShare(expandedAnnouncement, e)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors flex items-center space-x-1.5"
              >
                <Share2 className="w-4 h-4 text-stone-600" />
                <span>{copiedId === expandedAnnouncement.id ? 'Copied to Clipboard!' : 'Share Notice'}</span>
              </button>

              <button
                onClick={() => setExpandedAnnouncement(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-900 text-white hover:bg-amber-950 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
