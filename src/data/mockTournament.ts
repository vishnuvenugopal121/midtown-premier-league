
import { Tournament } from '@/types/cricketTypes';

export const mockTournament: Tournament = {
  id: "t1",
  name: "Midtown Premier League - Season 1",
  teams: [
    {
      id: "PH",
      name: "POWER HITTTERS",
      shortName: "PH",
      logo: "/lovable-uploads/a146c3f4-cfe0-4226-86de-80e7ff6c358b.png",
      primaryColor: "#FFB627",
      captain: "David Miller",
      players: ["David Miller", "Chris Lynn", "Andre Russell", "Nicholas Pooran"]
    },
    {
      id: "GW",
      name: "GYMKHANA WARHAWKS",
      shortName: "GW",
      logo: "/lovable-uploads/498d1319-0401-4a8a-a92e-4b8cceeeae79.png",
      primaryColor: "#FF4B12",
      captain: "Marcus Stoinis",
      players: ["Marcus Stoinis", "Jason Roy", "Mitchell Marsh", "Sam Curran"]
    },
    {
      id: "TT",
      name: "THE TARGARYANS",
      shortName: "TT",
      logo: "/lovable-uploads/d3b66573-a75e-48b9-ac23-5d029be51fd0.png",
      primaryColor: "#D50000",
      captain: "Ben Stokes",
      players: ["Ben Stokes", "Jos Buttler", "Moeen Ali", "Liam Livingstone"]
    },
    {
      id: "HU",
      name: "HEXARCHS UNITED",
      shortName: "HU",
      logo: "/lovable-uploads/0f599c54-b539-493e-8905-d1f39a500422.png",
      primaryColor: "#DAA520",
      captain: "Kane Williamson",
      players: ["Kane Williamson", "Mitchell Santner", "Devon Conway", "Glenn Phillips"]
    }
  ],
  matches: [
    {
      id: "m1",
      matchNumber: 1,
      teamA: "HU",
      teamB: "GW",
      date: "2025-04-06",
      time: "19:30",
      venue: "Club-T Turf, Kochi",
      status: "completed",
      result: {
        winner: "HU",
        loser: "GW",
        winningTeamScore: "186/4",
        losingTeamScore: "174/8",
        winMargin: "12 runs"
      }
    },
    {
      id: "m2",
      matchNumber: 2,
      teamA: "PH",
      teamB: "TT",
      date: "2025-04-08",
      time: "19:30",
      venue: "Club-T Turf, Kochi",
      status: "completed",
      result: {
        winner: "PH",
        loser: "TT",
        winningTeamScore: "192/3",
        losingTeamScore: "182/9",
        winMargin: "10 runs"
      }
    },
    {
      id: "m3",
      matchNumber: 3,
      teamA: "HU",
      teamB: "PH",
      date: "2025-04-10",
      time: "19:30",
      venue: "Club-T The Football Turf Kochi",
      status: "completed",
      result: {
        winner: "HU",
        loser: "PH",
        winningTeamScore: "175/5",
        losingTeamScore: "169/8",
        winMargin: "6 runs"
      }
    },
    {
      id: "m4",
      matchNumber: 4,
      teamA: "TT",
      teamB: "GW",
      date: "2025-04-12",
      time: "15:30",
      venue: "Club-T Turf, Kochi",
      status: "completed",
      result: {
        winner: "TT",
        loser: "GW",
        winningTeamScore: "195/4",
        losingTeamScore: "165/9",
        winMargin: "30 runs"
      }
    },
    {
      id: "m5",
      matchNumber: 5,
      teamA: "HU",
      teamB: "TT",
      date: "2025-04-14",
      time: "19:30",
      venue: "Club-T The Football Turf Kochi",
      status: "scheduled"
    },
    {
      id: "m6",
      matchNumber: 6,
      teamA: "GW",
      teamB: "PH",
      date: "2025-04-16",
      time: "19:30",
      venue: "Club-T Turf, Kochi",
      status: "scheduled"
    },
    {
      id: "m7",
      matchNumber: 7,
      teamA: "TBD",
      teamB: "TBD",
      date: "2025-04-20",
      time: "19:30",
      venue: "Club-T Turf, Kochi",
      status: "scheduled",
      isFinal: true
    }
  ],
  standings: [
    {
      teamId: "HU",
      played: 3,
      won: 2,
      lost: 1,
      nrr: 0.744,
      points: 4,
      lastFiveResults: [true, true]
    },
    {
      teamId: "PH",
      played: 2,
      won: 1,
      lost: 1,
      nrr: 0.281,
      points: 2,
      lastFiveResults: [true, false]
    },
    {
      teamId: "TT",
      played: 2,
      won: 1,
      lost: 1,
      nrr: 0.172,
      points: 2,
      lastFiveResults: [false, true]
    },
    {
      teamId: "GW",
      played: 2,
      won: 0,
      lost: 2,
      nrr: -0.872,
      points: 0,
      lastFiveResults: [false, false]
    }
  ]
};
