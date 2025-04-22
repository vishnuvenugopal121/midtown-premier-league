
// Team-related types
export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  captain?: string;
  players?: string[];
}

// Match status
export type MatchStatus = 'scheduled' | 'live' | 'completed';

// Match result
export interface MatchResult {
  winner: string;
  loser: string;
  winningTeamScore: string;
  losingTeamScore: string;
  winMargin: string;
  playerOfMatch?: string;
  winningTeamOversFaced?: number;
  losingTeamOversFaced?: number;
  nrr?: number; // Net Run Rate
}

// Match details
export interface Match {
  match_id: string;
  matchNumber: number;
  team1: string; // Team ID
  team2: string; // Team ID
  date: string;
  time: string;
  venue: string;
  status: MatchStatus;
  result?: MatchResult;
  isFinal?: boolean;
}

// Team statistics in points table
export interface TeamStats {
  team_id: string;
  played: number;
  won: number;
  lost: number;
  nrr: number;
  points: number;
  lastFiveResults: Array<boolean>; // true for win, false for loss
}

// Tournament data
export interface Tournament {
  id: string;
  name: string;
  teams: Team[];
  matches: Match[];
  standings: TeamStats[];
}
