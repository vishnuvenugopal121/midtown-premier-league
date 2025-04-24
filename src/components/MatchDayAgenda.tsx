import React from 'react';
import { Calendar, Clock, Trophy, Users, Flag } from 'lucide-react';

interface AgendaItem {
  time: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const MatchDayAgenda = () => {
  const agendaItems: AgendaItem[] = [
    {
      time: "4:00 PM",
      title: "Arrival & Check-In",
      description: "Players to assemble on the field for warm-up drills and pre-match preparations",
      icon: <Users className="w-5 h-5" />
    },
    {
      time: "4:30 PM",
      title: "Team Line-Up & Introductions",
      description: "Brief team introductions and group photo session",
      icon: <Flag className="w-5 h-5" />
    },
    {
      time: "4:50 PM",
      title: "Inaugural Address",
      description: "A short message to kick off the event and energize the teams",
      icon: <Calendar className="w-5 h-5" />
    },
    {
      time: "5:00 PM - 9:45 PM",
      title: "Match Time",
      description: "7 matches including 1 final",
      icon: <Clock className="w-5 h-5" />
    },
    {
      time: "9:45 PM",
      title: "Awards Ceremony",
      description: "Champion Trophy Presentation",
      icon: <Trophy className="w-5 h-5" />
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-white">🗓️ Event Schedule</h2>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/20"></div>
        
        <div className="space-y-8">
          {agendaItems.map((item, index) => (
            <div key={index} className="relative flex items-start">
              {/* Circle on the line */}
              <div className="absolute left-6 top-2 w-3 h-3 rounded-full bg-white transform -translate-x-1/2"></div>
              
              <div className="ml-12">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-white font-medium">{item.time}</span>
                </div>
                <h3 className="text-white font-semibold mt-1">{item.title}</h3>
                <p className="text-white/80 text-sm mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchDayAgenda; 