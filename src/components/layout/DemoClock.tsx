'use client';

import React from 'react';
import { Clock, RotateCcw, Plus, CalendarDays } from 'lucide-react';
import { useAicte } from '@/context/AicteContext';
import { formatDateDisplay } from '@/lib/deadlineEngine';

export function DemoClock() {
  const { demoDate, baseDate, advanceDemoDays, resetDemoDate, daysOffsetFromBase } = useAicte();

  const formattedDate = formatDateDisplay(demoDate);
  const isShifted = daysOffsetFromBase !== 0;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 rounded-2xl border border-blue-200/90 bg-blue-50/70 p-1 sm:p-1.5 shadow-2xs">
      {/* Current Simulated Date Pill */}
      <div className="flex items-center gap-1.5 px-2 py-0.5 sm:py-1">
        <div className="relative flex items-center justify-center">
          <Clock className="h-4 w-4 text-blue-700" />
          {isShifted && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </div>
        <div className="text-left">
          <span className="hidden xl:block text-[9px] font-bold uppercase tracking-wider text-blue-700/80 leading-none">
            Demo Clock
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
              {formattedDate}
            </span>
            {isShifted && (
              <span className="rounded-full bg-blue-600 text-white px-1.5 py-0.2 text-[10px] font-bold">
                {daysOffsetFromBase > 0 ? `+${daysOffsetFromBase}d` : `${daysOffsetFromBase}d`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Advance Buttons */}
      <div className="flex items-center gap-1 border-l border-blue-200/80 pl-1.5">
        <button
          type="button"
          onClick={() => advanceDemoDays(1)}
          title="Advance demo date by 1 day"
          className="rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-blue-600 hover:text-white border border-slate-200/80 shadow-2xs transition-colors"
        >
          +1d
        </button>

        <button
          type="button"
          onClick={() => advanceDemoDays(7)}
          title="Advance demo date by 7 days"
          className="rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-blue-600 hover:text-white border border-slate-200/80 shadow-2xs transition-colors"
        >
          +7d
        </button>

        <button
          type="button"
          onClick={() => advanceDemoDays(30)}
          title="Advance demo date by 30 days"
          className="hidden sm:inline-block rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-blue-600 hover:text-white border border-slate-200/80 shadow-2xs transition-colors"
        >
          +30d
        </button>

        {/* Reset Button */}
        <button
          type="button"
          onClick={resetDemoDate}
          disabled={!isShifted}
          title="Reset demo clock to base date (02 Nov 2026)"
          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition-colors ${
            isShifted
              ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white shadow-2xs'
              : 'bg-transparent text-slate-400 opacity-40 cursor-not-allowed'
          }`}
        >
          <RotateCcw className="h-3 w-3" />
          <span className="hidden md:inline">Reset</span>
        </button>
      </div>
    </div>
  );
}
