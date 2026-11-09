export type UserRole = 'traveler' | 'host' | 'both';
export type HostingStatus = 'ready_for_hosting' | 'not_hosting' | 'traveling';
export type RoomType = 'private_room' | 'shared_room' | 'entire_place' | 'couch';
export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'canceled' | 'completed';
export type VerificationStatus = 'unverified' | 'pending' | 'approved' | 'rejected';

export type GuestPreference = 'females_only' | 'males_only' | 'couples_families' | 'any';
export type SleepingArrangement = 'private_with_bed' | 'private_without_bed' | 'shared_space';

export interface UserProfile {
  id: string;
  // Personal Info (Google Form Page 1)
  full_name: string;
  phone?: string;
  instagram?: string;
  city: string;
  province?: string;
  age?: number;
  job_education?: string;
  avatar_url?: string;

  // Role & Hosting Capability (Google Form Page 2)
  can_host?: boolean;
  role: UserRole;
  hosting_status: HostingStatus;
  max_guests?: number;
  guest_preference?: GuestPreference;
  sleeping_arrangement?: SleepingArrangement;

  // Home & Listing Details (for Hosts)
  amenities?: string[];
  neighborhood_name?: string;
  home_description?: string;
  home_photos?: string[];

  // House Rules & Travel Plans (Google Form Page 3)
  house_rules?: string[];
  target_destination?: string;
  target_travel_dates?: string;
  target_guests_count?: number;
  bio_headline?: string;
  about_me?: string;
  interests?: string[];
  languages?: string[];
  favorite_destinations?: string[];

  // Terms & Commitments (Google Form Page 4)
  agreed_to_provide_id?: boolean;
  agreed_to_respect_house_rules?: boolean;
  agreed_to_hamja_terms?: boolean;

  // Account Credentials
  username?: string;
  password?: string;

  // Verification & Safety
  verification_status: VerificationStatus;
  is_identity_verified: boolean;
  rejection_reason?: string;
  verification_docs?: {
    national_card_url?: string;
    selfie_with_card_url?: string;
    submitted_at?: string;
    rejection_reason?: string;
    home_details?: {
      amenities?: string[];
      neighborhood_name?: string;
      home_description?: string;
      home_photos?: string[];
    };
  };

  // Metadata
  member_since_year: string;
  response_rate_percent: number;
  hosting_count: number;
  last_active?: string;
  created_at?: string;
}

export interface Profile extends UserProfile {}

export interface HomeListing {
  id: string;
  host_id: string;
  title: string;
  room_type: RoomType;
  room_type_label: string;
  capacity: number;
  amenities: string[];
  house_rules: string[];
  exact_address: string;
  neighborhood_name: string;
  photos: string[];
  is_active: boolean;
}

export interface PastHosting {
  id: string;
  guest_name: string;
  guest_city: string;
  stay_date: string;
  nights_count: number;
  story_snippet: string;
  guest_avatar?: string;
}

export interface Review {
  id: string;
  reviewer_name: string;
  reviewer_city: string;
  reviewer_avatar: string;
  rating: number;
  comment: string;
  stay_date_label: string;
  is_verified_experience: boolean;
}

export interface HostingRequest {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  sender_city: string;
  receiver_id: string;
  receiver_name: string;
  receiver_avatar?: string;
  receiver_city: string;
  listing_id?: string;
  start_date: string;
  end_date: string;
  guest_count: number;
  message: string;
  status: RequestStatus;
  request_type?: 'stay_request' | 'host_invitation';
  host_response_note?: string;
  exact_address_unlocked?: string;
  created_at: string;
}
