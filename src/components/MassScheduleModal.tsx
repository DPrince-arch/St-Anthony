'use client';

import React from 'react';
import { Clock, Calendar, Church, X, Heart } from 'lucide-react';
import { ParishSettings } from '@/lib/types';

interface MassScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ParishSettings | null;
}

export function MassScheduleModal({ isOpen, onClose, settings }: MassScheduleModalProps) {
  if (!isOpen) return null;

  const schedules = settings?.massSchedule || [
    { day: "Sunday", times: ["06:30 AM (Dawn Mass)", "08:30 AM (Family & Children Mass)", "10:30 AM (High / Choral Mass)", "06:00 PM (Youth Mass)"] },
    { day: "Monday - Friday", times: ["06:30 AM (Morning Mass)", "12:00 PM (Midday Mass)", "06:30 PM (Evening Mass)"] },
    { day: "Saturday", times: ["07:00 AM (Memorial of B.V.M)", "06:00 PM (Sunday Vigil Mass)"] }
  ];

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-800" />
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Liturgical Schedule
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mass Timetable */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
            Holy Mass Timetable
          </h4>

          <div className="space-y-3">
            {schedules.map((item, idx) => (
              <div key={idx} className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                <span className="font-serif font-bold text-base text-stone-900 block mb-1.5">
                  {item.day}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.times.map((t, tIdx) => (
                    <span 
                      key={tIdx}
                      className="text-xs bg-white text-stone-700 border border-stone-200 px-2.5 py-1 rounded-lg font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confession & Office Schedule */}
        <div className="pt-2 border-t border-stone-100 space-y-3 text-xs text-stone-600">
          <div>
            <span className="font-bold text-stone-900 block">Sacrament of Reconciliation (Confession):</span>
            <p className="mt-0.5">{settings?.confessionSchedule || "Saturdays after 7:00 AM Mass, and Wednesdays from 5:00 PM to 6:15 PM."}</p>
          </div>

          <div>
            <span className="font-bold text-stone-900 block">Parish Office & Priests Visiting Hours:</span>
            <p className="mt-0.5">{settings?.officeHours || "Tuesday - Friday: 9:00 AM - 4:00 PM (Father's Office: Wednesdays & Thursdays by appointment)"}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl font-semibold text-sm bg-stone-900 text-white hover:bg-black transition-colors"
        >
          Close Schedule
        </button>
      </div>
    </div>
  );
}
