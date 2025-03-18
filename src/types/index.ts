export type UserRole = 'taller' | 'taller_jr' | 'proveedor' | 'administrador' | 'contador' | 'contador_jr';

export type RequestStatus =
  | 'status_minus_1'
  | 'status_0_1'
  | 'status_0_2'
  | 'status_0_3'
  | 'status_0_4'
  | 'status_1'
  | 'status_2'
  | 'status_3'
  | 'status_4'
  | 'status_5'
  | 'status_6'
  | 'status_7'
  | 'status_8'
  | 'status_9'
  | 'status_10'
  | 'status_11'
  | 'status_12'
  | 'status_13';

export type RepairType =
  | 'llantas'
  | 'motor_tren_motriz'
  | 'aceite_motor'
  | 'suspension_acoplamiento'
  | 'electrico'
  | 'frenos'
  | 'hojalateria_pintura'
  | 'medidoras_bombas'
  | 'otro';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Provider {
  id: string;
  name: string;
  profile_id: string;
  created_at: string;
  updated_at: string;
}

export interface PartRequest {
  id: string;
  short_id: string;
  status: RequestStatus;
  unit_id: string;
  created_by: string;
  provider_id: string | null;
  problem_location: string;
  operator_detected: string;
  problem_description: string;
  damaged_parts_location: string;
  mechanic_work: string;
  assigned_mechanic: string;
  repair_type: RepairType;
  repair_type_other: string | null;
  observations: string;
  is_important: boolean;
  is_cash_payment: boolean;
  damage_photo_url: string | null;
  invoice_number: string | null;
  invoice_url: string | null;
  counter_receipt_url: string | null;
  edit_message: string | null;
  total_amount: number;
  created_at: string;
  updated_at: string;
  unit?: Unit;
  provider?: Provider;
}

export interface Part {
  id: string;
  part_request_id: string;
  name: string;
  description: string;
  cost: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  id: string;
  part_request_id: string;
  description: string;
  created_by: string;
  created_at: string;
}

export interface WeeklyTable {
  id: string;
  week_start: string;
  week_end: string;
  status: number;
  table_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyTableItem {
  id: string;
  weekly_table_id: string;
  part_request_id: string;
  created_at: string;
}

export interface VerificationRequest {
  id: string;
  profile_id: string;
  role: UserRole;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}