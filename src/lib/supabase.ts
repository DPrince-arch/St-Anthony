import { createClient } from '@supabase/supabase-js';
import type { BookingStatus, BookingType } from './types';

export const RECEIPTS_BUCKET = 'booking-receipts';

type BookingDatabaseRow = {
  id: string;
  reference_code: string;
  type: BookingType;
  parishioner_name: string;
  email: string;
  phone: string;
  intention_type: string | null;
  intention_for: string | null;
  requested_date: string;
  mass_time: string | null;
  appointment_reason: string | null;
  preferred_time_slot: string | null;
  notes: string | null;
  receipt_path: string | null;
  receipt_uploaded_at: string | null;
  status: BookingStatus;
  admin_notes: string | null;
  created_at: string;
};

type BookingInsert = Omit<BookingDatabaseRow, 'id' | 'created_at' | 'status'> & {
  id?: string;
  created_at?: string;
  status?: BookingStatus;
};

interface Database {
  public: {
    Tables: {
      bookings: {
        Row: BookingDatabaseRow;
        Insert: BookingInsert;
        Update: Partial<BookingInsert>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      booking_status_counts: {
        Args: Record<string, never>;
        Returns: { status: string; booking_count: number }[];
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}

let adminClient: ReturnType<typeof createClient<Database>> | undefined;

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured.');
  }

  adminClient ??= createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return adminClient;
}
