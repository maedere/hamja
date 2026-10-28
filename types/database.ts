export type UserRole = 'traveler' | 'host' | 'both';
export type HostingStatus = 'ready_for_hosting' | 'not_hosting' | 'traveling';
export type RoomType = 'private_room' | 'shared_room' | 'entire_place' | 'couch';
export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'canceled' | 'completed';
export type VerificationStatus = 'unverified' | 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  city: string;
  province?: string;
  role: UserRole;
  hosting_status: HostingStatus;
  bio_headline: string;
  about_me: string;
  interests: string[];
  languages: string[];
  favorite_destinations: string[];
  response_rate_percent: number;
  hosting_count: number;
  is_identity_verified: boolean;
  verification_status: VerificationStatus;
  member_since_year: string;
  last_active?: string;
  created_at?: string;
  updated_at?: string;
}

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
  host_response_note?: string;
  exact_address_unlocked?: string;
  created_at: string;
}
