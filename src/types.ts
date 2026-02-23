export interface IftarLocation {
  id?: string;
  name: string;
  category: 'mosque' | 'organization' | 'private';
  district: 'sylhet' | 'sunamganj' | 'moulvibazar' | 'habiganj';
  address: string;
  lat: number;
  lng: number;
  menu: string;
  time: string;
  contact: string;
  imageUrl?: string;
  verificationStatus: 'verified' | 'unverified' | 'suspicious';
  votes: {
    true: number;
    fake: number;
  };
  comments: Comment[];
  isApproved: boolean;
  createdAt: any; // Firestore Timestamp
}

export interface Comment {
  userName: string;
  text: string;
  timestamp: any;
}

export const DISTRICTS = [
  { value: 'sylhet', label: 'সিলেট' },
  { value: 'sunamganj', label: 'সুনামগঞ্জ' },
  { value: 'moulvibazar', label: 'মৌলভীবাজার' },
  { value: 'habiganj', label: 'হবিগঞ্জ' },
];

export const CATEGORIES = [
  { value: 'mosque', label: 'মসজিদ' },
  { value: 'organization', label: 'সংগঠন' },
  { value: 'private', label: 'ব্যক্তিগত উদ্যোগ' },
];
