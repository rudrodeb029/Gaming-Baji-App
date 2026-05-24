export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  percentage: string;
  kills: number;
  damage: number;
  headshots: number;
  rank: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  username: string;
  joinDate: string;
  language?: string;
}

export interface Match {
  id: string;
  group: string;
  totalPlayersCount: string;
  team1: Team;
  team2: Team;
  score: string;
  time: string;
  status: 'live' | 'upcoming' | 'finished';
  bids: string[];
  totalBidsCount: string;
  joinedUsers: User[];
  currentParticipants: number;
  maxParticipants: number;
  name: string;
  timeline: { time: string; event: string; team: string; player?: string }[];
  prizePool?: number;
  firstPrize?: number;
  secondPrize?: number;
  thirdPrize?: number;
}

export const mockUsers: User[] = [
  { id: '1', name: 'Elite Moco', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Moco', username: '@mocotech', joinDate: '2025-01-15' },
  { id: '2', name: 'Kelly Swift', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kelly', username: '@kellyrunner', joinDate: '2024-11-20' },
  { id: '3', name: 'Alok Rhythms', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alok', username: '@alokdj', joinDate: '2025-02-01' },
  { id: '4', name: 'Hayato Bushido', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hayato', username: '@hayatosword', joinDate: '2025-03-10' },
  { id: '5', name: 'Chrono Shield', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chrono', username: '@chronos', joinDate: '2024-12-05' },
  { id: '6', name: 'Wukong Simian', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wukong', username: '@monkeyking', joinDate: '2025-01-20' },
  { id: '7', name: 'K Maxim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maxim', username: '@maximk', joinDate: '2025-02-15' },
  { id: '8', name: 'Skyler Beats', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Skyler', username: '@skyler', joinDate: '2025-03-01' },
];

export const matches: Match[] = [
  {
    id: 'm1',
    name: 'Bermuda Battle Royale',
    group: 'Solo Match',
    totalPlayersCount: '48 Players',
    status: 'live',
    score: '12 - 8',
    time: '14:20',
    bids: ['$5', '$10', '$25', '$50'],
    totalBidsCount: '1.2K Players joined',
    currentParticipants: 32,
    maxParticipants: 48,
    team1: {
      id: 't1', name: 'Red Dragons', shortName: 'RDG', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=red', color: '#DC2626', percentage: '65%',
      kills: 12, damage: 4500, headshots: 5, rank: 2
    },
    team2: {
      id: 't2', name: 'Shadow Ninjas', shortName: 'SHN', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=shadow', color: '#F59E0B', percentage: '35%',
      kills: 8, damage: 3200, headshots: 2, rank: 5
    },
    joinedUsers: [mockUsers[0], mockUsers[1], mockUsers[2]],
    timeline: [
      { time: '02:15', event: 'First Blood', team: 't1', player: 'Drago' },
      { time: '05:40', event: 'Double Kill', team: 't2', player: 'Zinx' },
    ]
  },
  {
    id: 'm2',
    name: 'Purgatory Survival',
    group: 'Duo Match',
    totalPlayersCount: '24 Teams',
    status: 'live',
    score: '5 - 3',
    time: '08:45',
    bids: ['$10', '$50', '$100', '$200'],
    totalBidsCount: '800 Players joined',
    currentParticipants: 20,
    maxParticipants: 24,
    team1: {
      id: 't3', name: 'Frost Walkers', shortName: 'FRW', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=frost', color: '#3B82F6', percentage: '50%',
      kills: 5, damage: 2100, headshots: 3, rank: 8
    },
    team2: {
      id: 't4', name: 'Storm Breakers', shortName: 'STB', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=storm', color: '#A855F7', percentage: '50%',
      kills: 3, damage: 1800, headshots: 1, rank: 12
    },
    joinedUsers: [mockUsers[3], mockUsers[4]],
    timeline: [
      { time: '01:20', event: 'Grenade Kill', team: 't3', player: 'Iceman' },
    ]
  },
  {
    id: 'm3',
    name: 'Kalahari Clash Squad',
    group: 'Squad Match',
    totalPlayersCount: '12 Teams',
    status: 'upcoming',
    score: '0 - 0',
    time: '21:00',
    bids: ['$20', '$100', '$250', '$500'],
    totalBidsCount: '0 Players joined',
    currentParticipants: 0,
    maxParticipants: 12,
    team1: {
      id: 't5', name: 'Inferno Squad', shortName: 'INF', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=inferno', color: '#1F2937', percentage: '55%',
      kills: 0, damage: 0, headshots: 0, rank: 0
    },
    team2: {
      id: 't6', name: 'Cyber Elites', shortName: 'CYB', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=cyber', color: '#EF4444', percentage: '45%',
      kills: 0, damage: 0, headshots: 0, rank: 0
    },
    joinedUsers: [mockUsers[0], mockUsers[4]],
    timeline: []
  },
  {
    id: 'm4',
    name: 'Alpine Duel',
    group: 'Dot Match',
    totalPlayersCount: '24 Teams',
    status: 'upcoming',
    score: '0 - 0',
    time: '23:30',
    bids: ['$5', '$15', '$30', '$60'],
    totalBidsCount: '120 Players joined',
    currentParticipants: 8,
    maxParticipants: 24,
    team1: {
      id: 't7', name: 'Silent Killers', shortName: 'SLK', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=silent', color: '#10B981', percentage: '70%',
      kills: 0, damage: 0, headshots: 0, rank: 0
    },
    team2: {
      id: 't8', name: 'Swift Snipers', shortName: 'SWS', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=snipers', color: '#F59E0B', percentage: '30%',
      kills: 0, damage: 0, headshots: 0, rank: 0
    },
    joinedUsers: [mockUsers[1], mockUsers[2]],
    timeline: []
  }
];

export const currentUser: User = {
  id: 'me',
  name: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  username: '@johndoe123',
  joinDate: '2023-05-12'
};

export interface Winner {
  id: string;
  name: string;
  avatar: string;
  amount: string;
  match: string;
  time: string;
}

export const winners: Winner[] = [
  { id: 'w1', name: 'Elite Moco', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Moco', amount: '$450', match: 'Solo Match', time: '2 hours ago' },
  { id: 'w2', name: 'Kelly Swift', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kelly', amount: '$1,200', match: 'Squad Match', time: '5 hours ago' },
  { id: 'w3', name: 'Alok Rhythms', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alok', amount: '$320', match: 'Duo Match', time: 'Yesterday' },
  { id: 'w4', name: 'Hayato Bushido', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hayato', amount: '$890', match: 'Squad Match', time: 'Yesterday' },
  { id: 'w5', name: 'Chrono Shield', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chrono', amount: '$540', match: 'Solo Match', time: '2 days ago' },
];

export interface TopParticipant {
  id: string;
  name: string;
  avatar: string;
  level: number;
  matches: number;
}

export const topParticipants: TopParticipant[] = [
  { id: 'p1', name: 'Elite Moco', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Moco', level: 68, matches: 142 },
  { id: 'p2', name: 'Kelly Swift', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kelly', level: 72, matches: 98 },
  { id: 'p3', name: 'Alok Rhythms', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alok', level: 55, matches: 215 },
  { id: 'p4', name: 'Hayato Bushido', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hayato', level: 62, matches: 167 },
  { id: 'p5', name: 'Chrono Shield', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chrono', level: 75, matches: 84 },
];

export interface SecurityNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'info' | 'success';
}

export const securityNotifications: SecurityNotification[] = [
  { id: 's1', title: 'New Login Detected', message: 'A new login was detected from a Windows device in Dhaka.', time: '2 hours ago', type: 'alert' },
  { id: 's2', title: 'Password Changed', message: 'Your account password was successfully updated.', time: '1 day ago', type: 'success' },
  { id: 's3', title: 'Payment Method Added', message: 'A new Bkash account has been linked to your wallet.', time: '3 days ago', type: 'info' },
  { id: 's4', title: 'Email Verified', message: 'Thank you for verifying your email address.', time: '5 days ago', type: 'success' },
];

