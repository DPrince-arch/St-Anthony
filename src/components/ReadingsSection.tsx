'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  BookMarked,
  Feather,
  Share2,
  Check
} from 'lucide-react';
import { DailyLiturgicalReadings } from '@/lib/types';
import { LITURGICAL_COLORS } from '@/lib/liturgicalData';

interface ReadingsSectionProps {
  initialReadings: DailyLiturgicalReadings | null;
  onDateChange: (dateStr: string) => void;
  selectedDate: string;
}

export function ReadingsSection({ initialReadings, onDateChange, selectedDate }: ReadingsSectionProps) {
  const [readings, setReadings] = useState<DailyLiturgicalReadings | null>(initialReadings);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'first' | 'psalm' | 'second' | 'gospel' | 'reflection'>('all');

  // Synchronize when initialReadings changes
  useEffect(() => {
    setReadings(initialReadings);
  }, [initialReadings]);

  // Adjust date by offset
  const shiftDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    const newDateStr = current.toISOString().split('T')[0];
    onDateChange(newDateStr);
  };

  const setToday = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    onDateChange(todayStr);
  };

  // Web Speech API Read Aloud
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert("Audio speech synthesis is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!readings) return;

    const fullSpeechText = `
      Liturgical Readings for ${readings.celebrationTitle}.
      First Reading, from ${readings.readings.firstReading.citation}. ${readings.readings.firstReading.text}.
      Responsorial Psalm, from ${readings.readings.psalm.citation}. Response: ${readings.readings.psalm.response}.
      ${readings.readings.secondReading ? `Second Reading, from ${readings.readings.secondReading.citation}. ${readings.readings.secondReading.text}.` : ''}
      The Holy Gospel according to ${readings.readings.gospel.citation}. ${readings.readings.gospel.text}.
      Reflection: ${readings.dailyReflection?.text || ''}
    `;

    const utterance = new SpeechSynthesisUtterance(fullSpeechText);
    utterance.rate = 0.9; // Reverent measured pace
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Copy Citation / Share
  const handleShare = () => {
    if (!readings) return;
    const shareText = `Catholic Daily Readings - ${readings.celebrationTitle} (${readings.date})\nFirst Reading: ${readings.readings.firstReading.citation}\nPsalm: ${readings.readings.psalm.citation}\nGospel: ${readings.readings.gospel.citation}\n\nSt. Anthony Catholic Church App`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const colorConfig = readings ? LITURGICAL_COLORS[readings.color] : LITURGICAL_COLORS.green;

  // Font sizing styles
  const fontClasses = {
    normal: 'text-base sm:text-lg leading-relaxed',
    large: 'text-lg sm:text-xl leading-relaxed',
    xlarge: 'text-xl sm:text-2xl leading-relaxed'
  }[fontSize];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Top Toolbar: Date Picker & Accessibility Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Date Navigator */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={() => shiftDate(-1)}
            className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-sm font-medium text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
            <button
              onClick={setToday}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-900 text-amber-50 hover:bg-amber-950 transition-colors shadow-xs"
            >
              Today
            </button>
          </div>

          <button
            onClick={() => shiftDate(1)}
            className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Reader Controls: Audio Speech, Font Size, Share */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
          {/* Audio Speech */}
          <button
            onClick={handleToggleSpeech}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              isSpeaking
                ? 'bg-red-50 text-red-700 border-red-200 ring-2 ring-red-400/20'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 animate-pulse text-red-600" /> : <Volume2 className="w-4 h-4 text-amber-700" />}
            <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
          </button>

          {/* Font Resizing */}
          <div className="flex items-center bg-stone-50 rounded-xl border border-stone-200 p-0.5">
            <button
              onClick={() => setFontSize(prev => prev === 'xlarge' ? 'large' : 'normal')}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white rounded-lg transition-colors"
              title="Decrease Font Size"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-semibold text-stone-500 px-1.5 uppercase">
              {fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}
            </span>
            <button
              onClick={() => setFontSize(prev => prev === 'normal' ? 'large' : 'xlarge')}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white rounded-lg transition-colors"
              title="Increase Font Size"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors"
            title="Copy Readings Citation"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {readings ? (
        <>
          {/* Liturgical Day Header Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-sm p-6 sm:p-7">
            <div 
              className="absolute top-0 left-0 right-0 h-2" 
              style={{ backgroundColor: colorConfig.hex }} 
            />
            
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center space-x-2">
                <span 
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase shadow-xs"
                  style={{ backgroundColor: `${colorConfig.hex}18`, color: colorConfig.hex }}
                >
                  <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: colorConfig.hex }} />
                  {colorConfig.name} Vestments
                </span>
                <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                  {readings.season}
                </span>
              </div>
              <span className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full">
                {readings.rank}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-snug">
              {readings.celebrationTitle}
            </h2>

            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-sans">
              {new Date(readings.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            {readings.saintOfTheDay && (
              <div className="mt-4 pt-4 border-t border-stone-100 flex items-start space-x-2 text-xs sm:text-sm text-stone-600">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900">Commemoration: </span>
                  <span>{readings.saintOfTheDay}</span>
                  {readings.saintSummary && (
                    <p className="text-stone-500 text-xs mt-0.5 italic">{readings.saintSummary}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Tab Selector for Long Texts */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 no-scrollbar border-b border-stone-200">
            {[
              { id: 'all', label: 'Continuous View' },
              { id: 'first', label: 'First Reading' },
              { id: 'psalm', label: 'Responsorial Psalm' },
              ...(readings.readings.secondReading ? [{ id: 'second', label: 'Second Reading' }] : []),
              { id: 'gospel', label: 'Holy Gospel' },
              { id: 'reflection', label: 'Homily & Reflection' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-amber-900 text-amber-50 shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Readings Content */}
          <div className="space-y-6">
            {/* FIRST READING */}
            {(activeTab === 'all' || activeTab === 'first') && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                  <div className="flex items-center space-x-2">
                    <BookMarked className="w-5 h-5 text-amber-800" />
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900">First Reading</h3>
                  </div>
                  <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
                    {readings.readings.firstReading.citation}
                  </span>
                </div>
                <div className={`font-serif text-stone-800 ${fontClasses}`}>
                  <p className="italic text-stone-500 text-sm mb-3">A reading from the Book of {readings.readings.firstReading.citation.split(' ')[0]}</p>
                  <p className="leading-relaxed">{readings.readings.firstReading.text}</p>
                  <p className="mt-4 text-xs font-sans font-semibold text-stone-500 uppercase tracking-wider">The Word of the Lord. <span className="text-amber-900 font-bold">R. Thanks be to God.</span></p>
                </div>
              </div>
            )}

            {/* RESPONSORIAL PSALM */}
            {(activeTab === 'all' || activeTab === 'psalm') && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                  <div className="flex items-center space-x-2">
                    <Feather className="w-5 h-5 text-amber-800" />
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900">Responsorial Psalm</h3>
                  </div>
                  <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
                    {readings.readings.psalm.citation}
                  </span>
                </div>
                
                <div className="bg-amber-50/80 border-l-4 border-amber-800 p-4 rounded-r-xl mb-5">
                  <span className="text-xs uppercase font-sans font-bold text-amber-900 tracking-wider block mb-1">Response:</span>
                  <p className="font-serif font-semibold text-base sm:text-lg text-amber-950">
                    {readings.readings.psalm.response}
                  </p>
                </div>

                <div className={`space-y-4 font-serif text-stone-800 ${fontClasses}`}>
                  {readings.readings.psalm.verses.map((strophe, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="leading-relaxed">{strophe}</p>
                      <p className="text-xs font-sans text-amber-800 font-semibold italic">
                        R. {readings.readings.psalm.response}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECOND READING (IF PRESENT) */}
            {readings.readings.secondReading && (activeTab === 'all' || activeTab === 'second') && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                  <div className="flex items-center space-x-2">
                    <BookMarked className="w-5 h-5 text-amber-800" />
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900">Second Reading</h3>
                  </div>
                  <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
                    {readings.readings.secondReading.citation}
                  </span>
                </div>
                <div className={`font-serif text-stone-800 ${fontClasses}`}>
                  <p className="leading-relaxed">{readings.readings.secondReading.text}</p>
                  <p className="mt-4 text-xs font-sans font-semibold text-stone-500 uppercase tracking-wider">The Word of the Lord. <span className="text-amber-900 font-bold">R. Thanks be to God.</span></p>
                </div>
              </div>
            )}

            {/* GOSPEL ACCLAMATION & HOLY GOSPEL */}
            {(activeTab === 'all' || activeTab === 'gospel') && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border-2 border-amber-900/10">
                {/* Gospel Acclamation */}
                <div className="bg-stone-50 rounded-xl p-4 mb-6 border border-stone-200 text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-800 block mb-1">
                    Alleluia, Alleluia!
                  </span>
                  <p className="font-serif italic text-stone-700 text-sm sm:text-base">
                    "{readings.readings.gospelAcclamation.verse}"
                  </p>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-800 mt-1 block">
                    Alleluia!
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800">The Good News</span>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-950">The Holy Gospel</h3>
                  </div>
                  <span className="text-xs font-semibold text-amber-900 bg-amber-100/70 border border-amber-200 px-3 py-1 rounded-full">
                    {readings.readings.gospel.citation}
                  </span>
                </div>

                <div className={`font-serif text-stone-900 ${fontClasses}`}>
                  <p className="text-xs sm:text-sm font-sans font-medium text-stone-500 mb-3">
                    A reading from the Holy Gospel according to {readings.readings.gospel.citation.split(' ')[0]}
                    <span className="block text-amber-900 font-bold mt-0.5">R. Glory to you, O Lord.</span>
                  </p>
                  
                  <p className="leading-relaxed first-letter:float-left first-letter:text-4xl first-letter:font-bold first-letter:mr-2 first-letter:text-amber-950">
                    {readings.readings.gospel.text}
                  </p>

                  <p className="mt-5 text-xs font-sans font-semibold text-stone-500 uppercase tracking-wider">
                    The Gospel of the Lord. <span className="text-amber-900 font-bold">R. Praise to you, Lord Jesus Christ.</span>
                  </p>
                </div>
              </div>
            )}

            {/* DAILY REFLECTION */}
            {readings.dailyReflection && (activeTab === 'all' || activeTab === 'reflection') && (
              <div className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-2xl p-6 sm:p-8 shadow-xs border border-amber-200/80">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-amber-800 text-white flex items-center justify-center font-serif text-sm font-bold">
                    ✝
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-amber-950">Daily Pastoral Reflection</h3>
                    <p className="text-xs text-amber-800 font-medium">{readings.dailyReflection.author}</p>
                  </div>
                </div>
                <p className="font-serif text-stone-800 text-base sm:text-lg leading-relaxed italic">
                  "{readings.dailyReflection.text}"
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <BookMarked className="w-12 h-12 text-stone-300 mx-auto mb-3 animate-pulse" />
          <p className="text-stone-500 font-serif">Retrieving liturgical lectionary readings...</p>
        </div>
      )}
    </div>
  );
}
