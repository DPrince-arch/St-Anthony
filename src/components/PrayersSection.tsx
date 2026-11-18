'use client';

import React, { useState } from 'react';
import { 
  Search, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  CircleDot,
  ArrowRight,
  ArrowLeft,
  Languages
} from 'lucide-react';
import { PRAYERS } from '@/lib/prayerData';
import { BilingualLine, Prayer, PrayerCategory, RosaryMysteryGroup } from '@/lib/types';

const CATEGORIES: { id: 'all' | PrayerCategory; label: string }[] = [
  { id: 'all', label: 'All Prayers' },
  { id: 'rosary', label: 'Holy Rosary' },
  { id: 'litany', label: 'Litanies' },
  { id: 'devotion', label: 'Devotions' },
  { id: 'stations', label: 'Stations of the Cross' },
  { id: 'mass', label: 'Order of Mass' },
  { id: 'benediction', label: 'Benediction' }
];

const CATEGORY_LABELS: Record<PrayerCategory, string> = {
  rosary: 'Rosary',
  litany: 'Litany',
  devotion: 'Devotion',
  stations: 'Stations of the Cross',
  mass: 'Holy Mass',
  benediction: 'Benediction'
};

type Language = 'en' | 'la';

function BilingualLineView({ line, language }: { line: BilingualLine; language: Language }) {
  if (line.role === 'rubric') {
    return <p className="font-sans text-xs sm:text-sm italic text-red-800/80 leading-relaxed">{line.en}</p>;
  }
  const text = language === 'la' && line.la ? line.la : line.en;
  const marker = line.role === 'priest' ? '℣.' : line.role === 'people' ? '℟.' : null;
  return (
    <div className="flex gap-2.5">
      {marker ? (
        <span className="w-5 shrink-0 text-red-800 font-bold" aria-label={line.role === 'priest' ? 'Priest' : 'People'}>
          {marker}
        </span>
      ) : (
        <span className="w-5 shrink-0" aria-hidden="true" />
      )}
      <p className={`whitespace-pre-line leading-relaxed ${line.role === 'priest' ? 'text-stone-800' : 'text-amber-950 font-semibold'}`}>
        {text}
      </p>
    </div>
  );
}

export function PrayersSection() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | PrayerCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePrayer, setActivePrayer] = useState<Prayer | null>(PRAYERS[0]); // Default to Holy Rosary
  const [language, setLanguage] = useState<Language>('en');
  // Stations of the Cross: 0 = opening prayer, 1-14 = stations, 15 = closing prayer
  const [stationStep, setStationStep] = useState(0);

  // Rosary Interactive State
  const [selectedMysteryIndex, setSelectedMysteryIndex] = useState(0);

  React.useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const rosary = PRAYERS.find(p => p.id === 'holy-rosary');
    if (rosary?.mysteries) {
      const idx = rosary.mysteries.findIndex(m => m.days.includes(today));
      // Must run in the browser: the page is prerendered, and the weekday depends on the
      // visitor's local time zone, so it can't be computed during render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (idx !== -1) setSelectedMysteryIndex(idx);
    }
  }, []);
  const [currentDecadeIndex, setCurrentDecadeIndex] = useState(0);
  const [beadCount, setBeadCount] = useState(0);

  // Filter prayers
  const filteredPrayers = PRAYERS.filter(prayer => {
    const matchesCategory = selectedCategory === 'all' || prayer.category === selectedCategory;
    const matchesSearch = prayer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prayer.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prayer.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeMystery: RosaryMysteryGroup | undefined = activePrayer?.mysteries?.[selectedMysteryIndex];
  const activeDecade = activeMystery?.decades[currentDecadeIndex];

  const handleNextBead = () => {
    if (beadCount < 10) {
      setBeadCount(prev => prev + 1);
    } else {
      // Advance to next decade
      if (currentDecadeIndex < 4) {
        setCurrentDecadeIndex(prev => prev + 1);
        setBeadCount(0);
      }
    }
  };

  const handleResetRosary = () => {
    setCurrentDecadeIndex(0);
    setBeadCount(0);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Category Pills & Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
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
              placeholder="Search prayers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Prayer Directory */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white rounded-2xl border border-stone-200 p-3 shadow-xs">
            <h3 className="text-xs uppercase font-bold tracking-wider text-stone-400 px-3 py-2">
              Prayer Collection ({filteredPrayers.length})
            </h3>
            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
              {filteredPrayers.map((prayer) => {
                const isSelected = activePrayer?.id === prayer.id;
                return (
                  <button
                    key={prayer.id}
                    onClick={() => {
                      setActivePrayer(prayer);
                      setStationStep(0);
                      if (prayer.id === 'holy-rosary') {
                        setCurrentDecadeIndex(0);
                        setBeadCount(0);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-900 text-white shadow-xs font-semibold'
                        : 'hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-serif text-sm leading-snug">{prayer.title}</span>
                      </div>
                      {prayer.subtitle && (
                        <p className={`text-xs mt-0.5 line-clamp-1 ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                          {prayer.subtitle}
                        </p>
                      )}
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-200' : 'text-stone-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Active Prayer Reader */}
        <div className="lg:col-span-8">
          {activePrayer && (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
              {/* Prayer Title Header */}
              <div className="border-b border-stone-100 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 px-2 py-0.5 rounded-sm bg-amber-50 border border-amber-200/50">
                    {CATEGORY_LABELS[activePrayer.category]}
                  </span>
                  {activePrayer.bilingual && (
                    <div
                      role="group"
                      aria-label="Language"
                      className="flex items-center shrink-0 rounded-full bg-stone-100 p-0.5 text-xs font-semibold"
                    >
                      <Languages className="w-3.5 h-3.5 text-stone-500 mx-1.5" aria-hidden="true" />
                      {([
                        { id: 'en', label: 'English' },
                        { id: 'la', label: 'Latin' }
                      ] as const).map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setLanguage(opt.id)}
                          aria-pressed={language === opt.id}
                          className={`px-3 py-1 rounded-full transition-colors ${
                            language === opt.id
                              ? 'bg-amber-900 text-amber-50 shadow-xs'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
                  {activePrayer.title}
                </h2>
                {activePrayer.subtitle && (
                  <p className="text-sm font-serif italic text-amber-900/80 mt-1">
                    {activePrayer.subtitle}
                  </p>
                )}
                {activePrayer.description && (
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                    {activePrayer.description}
                  </p>
                )}
              </div>

              {/* SPECIFIC TO HOLY ROSARY: Interactive Mysteries & Bead Counter */}
              {activePrayer.id === 'holy-rosary' && activePrayer.mysteries && activeMystery && (
                <div className="space-y-6">
                  {/* Mystery Selector */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-stone-500 block">Select Mystery:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {activePrayer.mysteries.map((m, idx) => {
                        const isSelected = selectedMysteryIndex === idx;
                        return (
                          <button
                            key={m.name}
                            onClick={() => {
                              setSelectedMysteryIndex(idx);
                              setCurrentDecadeIndex(0);
                              setBeadCount(0);
                            }}
                            className={`p-2.5 rounded-xl text-left border transition-all ${
                              isSelected
                                ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                                : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                            }`}
                          >
                            <span className="text-xs font-serif font-bold block leading-tight">{m.name}</span>
                            <span className={`text-[10px] block mt-1 ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                              {m.days.join(', ')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Decade Selector */}
                  <div className="flex items-center justify-between border-y border-stone-100 py-3">
                    <span className="text-xs font-semibold text-stone-700">Decades:</span>
                    <div className="flex space-x-1.5">
                      {[0, 1, 2, 3, 4].map(dIdx => (
                        <button
                          key={dIdx}
                          onClick={() => {
                            setCurrentDecadeIndex(dIdx);
                            setBeadCount(0);
                          }}
                          className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                            currentDecadeIndex === dIdx
                              ? 'bg-amber-900 text-white scale-110 shadow-xs ring-2 ring-amber-300'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {dIdx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Decade Meditation Card */}
                  {activeDecade && (
                    <div className="bg-gradient-to-br from-amber-50/70 to-stone-50 border border-amber-200/80 rounded-2xl p-5 sm:p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Decade {activeDecade.number} of 5
                        </span>
                        <span className="text-xs font-semibold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                          Fruit: {activeDecade.fruit}
                        </span>
                      </div>
                      
                      <h3 className="font-serif font-bold text-xl text-stone-900">
                        {activeDecade.title}
                      </h3>

                      <p className="font-serif italic text-stone-700 text-sm sm:text-base leading-relaxed">
                        &quot;{activeDecade.scripture}&quot;
                      </p>
                    </div>
                  )}

                  {/* Interactive Bead Counter */}
                  <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-center space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                        Virtual Decade Bead Counter
                      </span>
                      <button
                        onClick={handleResetRosary}
                        className="text-xs text-stone-500 hover:text-stone-800 flex items-center space-x-1"
                        title="Restart from beginning"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>
                    </div>

                    {/* 10 Bead Visualizer */}
                    <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 my-2">
                      {Array.from({ length: 10 }).map((_, bIdx) => {
                        const isCounted = bIdx < beadCount;
                        const isCurrent = bIdx === beadCount;
                        return (
                          <div
                            key={bIdx}
                            onClick={() => setBeadCount(bIdx + 1)}
                            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                              isCounted
                                ? 'bg-amber-900 text-white shadow-xs'
                                : isCurrent
                                ? 'bg-amber-200 border-2 border-amber-700 text-amber-900 animate-pulse scale-105'
                                : 'bg-stone-200 text-stone-400 hover:bg-stone-300'
                            }`}
                          >
                            <span className="text-[10px] sm:text-xs font-bold">{bIdx + 1}</span>
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-xs text-stone-600 font-medium">
                      {beadCount === 0 && "Begin with: 1 Our Father. Then tap below for each Hail Mary."}
                      {beadCount > 0 && beadCount < 10 && `Hail Mary ${beadCount} of 10 prayed.`}
                      {beadCount === 10 && "Decade complete! Recite: Glory Be & Fatima Prayer, then proceed."}
                    </p>

                    {/* Primary Bead Button */}
                    <button
                      onClick={handleNextBead}
                      className="w-full py-3.5 rounded-xl font-serif text-sm sm:text-base font-bold bg-amber-900 text-amber-50 hover:bg-amber-950 active:scale-98 transition-all shadow-md flex items-center justify-center space-x-2"
                    >
                      {beadCount < 10 ? (
                        <>
                          <CircleDot className="w-5 h-5 text-amber-300" />
                          <span>Count Hail Mary ({beadCount}/10)</span>
                        </>
                      ) : currentDecadeIndex < 4 ? (
                        <>
                          <span>Advance to Decade {currentDecadeIndex + 2}</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span>Complete 5 Decades & Conclude</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* LITANIES CALL & RESPONSE RENDERING */}
              {activePrayer.verses && (
                <div className="space-y-3 font-serif">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs font-sans text-stone-600 flex items-center justify-between">
                    <span><strong>Format:</strong> Recite the Petition, followed by the response in bold.</span>
                  </div>

                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {activePrayer.verses.map((verse, vIdx) => (
                      <div 
                        key={vIdx}
                        className="p-2.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm sm:text-base"
                      >
                        <span className="text-stone-800">{verse.call}</span>
                        <span className="text-amber-900 font-bold shrink-0 sm:text-right">
                          R. {verse.response}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GENERAL DEVOTION CONTENT */}
              {activePrayer.content && (
                <div className="font-serif text-stone-800 text-base sm:text-lg leading-relaxed whitespace-pre-line bg-stone-50/50 p-5 rounded-2xl border border-stone-100">
                  {activePrayer.content}
                </div>
              )}

              {/* STATIONS OF THE CROSS: one station at a time */}
              {activePrayer.stations && (() => {
                const { opening, closing, versicle, stations } = activePrayer.stations;
                const lastStep = stations.length + 1;
                const station = stationStep >= 1 && stationStep <= stations.length ? stations[stationStep - 1] : null;
                const stepLabel = (step: number) =>
                  step === 0 ? 'Opening Prayer' : step === lastStep ? 'Closing Prayer' : `Station ${step}`;

                return (
                  <div className="space-y-5">
                    {/* Station picker */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-stone-500 block">Go to:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from({ length: lastStep + 1 }).map((_, step) => {
                          const isActive = stationStep === step;
                          const isEnd = step === 0 || step === lastStep;
                          return (
                            <button
                              key={step}
                              onClick={() => setStationStep(step)}
                              aria-label={stepLabel(step)}
                              aria-current={isActive ? 'step' : undefined}
                              className={`h-8 rounded-full text-xs font-bold transition-all ${isEnd ? 'px-3' : 'w-8'} ${
                                isActive
                                  ? 'bg-amber-900 text-white shadow-xs ring-2 ring-amber-300'
                                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                              }`}
                            >
                              {step === 0 ? 'Opening' : step === lastStep ? 'Closing' : step}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {station ? (
                      <div className="bg-gradient-to-br from-amber-50/70 to-stone-50 border border-amber-200/80 rounded-2xl p-5 sm:p-6 space-y-4 font-serif">
                        <div className="flex items-center justify-between font-sans">
                          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                            Station {station.number} of {stations.length}
                          </span>
                          <span className="text-xs font-semibold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                            {station.scripture}
                          </span>
                        </div>

                        <h3 className="font-bold text-xl text-stone-900">{station.title}</h3>

                        <div className="space-y-1 text-sm sm:text-base">
                          <p className="font-sans text-xs italic text-red-800/80">Genuflect.</p>
                          <p className="text-stone-800"><span className="text-red-800 font-bold mr-1.5">℣.</span>{versicle.call}</p>
                          <p className="text-amber-950 font-semibold"><span className="text-red-800 font-bold mr-1.5">℟.</span>{versicle.response}</p>
                        </div>

                        <p className="text-stone-700 text-sm sm:text-base leading-relaxed">{station.reading}</p>

                        <p className="text-stone-900 text-sm sm:text-base leading-relaxed italic border-l-2 border-amber-300 pl-3">
                          {station.prayer1}
                        </p>

                        <p className="text-stone-900 text-sm sm:text-base leading-relaxed italic border-l-2 border-amber-300 pl-3">
                          {station.prayer2}
                        </p>

                        <p className="font-sans text-xs italic text-red-800/80">Our Father, Hail Mary, Glory Be.</p>

                        <div className="border-t border-amber-200/80 pt-3">
                          <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-stone-500 block mb-1">
                            Stabat Mater
                          </span>
                          <p className="text-stone-700 text-sm italic whitespace-pre-line leading-relaxed">{station.stabatMater}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="font-serif text-stone-800 text-base sm:text-lg leading-relaxed whitespace-pre-line bg-stone-50/50 p-5 rounded-2xl border border-stone-100">
                        <h3 className="font-bold text-xl text-stone-900 mb-3">{stepLabel(stationStep)}</h3>
                        {stationStep === 0 ? opening : closing}
                      </div>
                    )}

                    {/* Previous / next */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setStationStep(s => Math.max(0, s - 1))}
                        disabled={stationStep === 0}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold border border-stone-200 text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>
                      <button
                        onClick={() => setStationStep(s => Math.min(lastStep, s + 1))}
                        disabled={stationStep === lastStep}
                        className="flex-1 py-3 rounded-xl font-serif text-sm font-bold bg-amber-900 text-amber-50 hover:bg-amber-950 disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                      >
                        <span>{stationStep < lastStep ? `Next: ${stepLabel(stationStep + 1)}` : 'Finished'}</span>
                        {stationStep < lastStep && <ArrowRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* BILINGUAL TEXTS (Order of Mass, Benediction) */}
              {activePrayer.bilingual && (
                <div className="space-y-6 font-serif text-sm sm:text-base" lang={language === 'la' ? 'la' : 'en'}>
                  {activePrayer.bilingual.map(section => (
                    <section key={section.title} className="space-y-3">
                      <div className="border-b border-stone-100 pb-1.5">
                        <h3 className="font-bold text-lg text-stone-900">
                          {language === 'la' ? section.titleLatin : section.title}
                        </h3>
                        {language === 'la' && (
                          <p className="font-sans text-xs text-stone-500" lang="en">{section.title}</p>
                        )}
                      </div>
                      <div className="space-y-2.5">
                        {section.lines.map((line, idx) => (
                          <BilingualLineView key={idx} line={line} language={language} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
