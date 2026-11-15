'use client';

import { useEffect, useState } from 'react';
import { DailyLiturgicalReadings } from './types';

interface ReadingsApiResponse {
  success: boolean;
  data?: DailyLiturgicalReadings;
  error?: string;
}

export function useLiturgicalReadings(date?: string) {
  const [today, setToday] = useState<string>();
  const [result, setResult] = useState<{
    date: string;
    readings: DailyLiturgicalReadings | null;
    error: string | null;
  } | null>(null);
  const requestedDate = date === undefined ? today : date;

  useEffect(() => {
    if (date !== undefined) return;
    const timer = window.setTimeout(() => setToday(new Date().toISOString().slice(0, 10)), 0);
    return () => window.clearTimeout(timer);
  }, [date]);

  useEffect(() => {
    if (!requestedDate) return;

    const controller = new AbortController();

    fetch(`/api/readings?date=${encodeURIComponent(requestedDate)}`, { signal: controller.signal })
      .then(async response => {
        const result = await response.json() as ReadingsApiResponse;
        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || `Unable to load liturgical readings (HTTP ${response.status}).`);
        }
        return result.data;
      })
      .then(readings => setResult({ date: requestedDate, readings, error: null }))
      .catch(cause => {
        if (controller.signal.aborted) return;
        const message = cause instanceof Error ? cause.message : 'Unable to load liturgical readings.';
        setResult({ date: requestedDate, readings: null, error: message });
        console.error('Failed to load liturgical readings:', cause);
      });

    return () => controller.abort();
  }, [requestedDate]);

  const currentResult = result?.date === requestedDate ? result : null;
  return {
    readings: currentResult?.readings ?? null,
    error: currentResult?.error ?? null,
    loading: Boolean(requestedDate) && !currentResult
  };
}
