import { createClient } from '@supabase/supabase-js';
import type { Booking, BookingStatus, BookingType } from './types';

export const RECEIPTS_BUCKET = 'booking-receipts';

export type BookingRow = {
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
  details: Record<string, string>;
  receipt_path: string | null;
  receipt_uploaded_at: string | null;
  status: BookingStatus;
  admin_notes: string | null;
  created_at: string;
};

type BookingInsert = Omit<BookingRow, 'id' | 'created_at' | 'status' | 'details'> & {
  id?: string;
  details?: Record<string, string>;
  created_at?: string;
  status?: BookingStatus;
};

interface Database {
  public: {
    Tables: {
      bookings: {
        Row: BookingRow;
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

export function toBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    referenceCode: row.reference_code,
    type: row.type,
    parishionerName: row.parishioner_name,
    email: row.email,
    phone: row.phone,
    intentionType: (row.intention_type ?? undefined) as Booking['intentionType'],
    intentionFor: row.intention_for ?? undefined,
    requestedDate: row.requested_date,
    massTime: row.mass_time ?? undefined,
    appointmentReason: (row.appointment_reason ?? undefined) as Booking['appointmentReason'],
    preferredTimeSlot: row.preferred_time_slot ?? undefined,
    notes: row.notes ?? undefined,
    details: row.details && Object.keys(row.details).length > 0 ? row.details : undefined,
    hasReceipt: Boolean(row.receipt_path),
    receiptUploadedAt: row.receipt_uploaded_at ?? undefined,
    status: row.status,
    adminNotes: row.admin_notes ?? undefined,
    createdAt: row.created_at
  };
}
