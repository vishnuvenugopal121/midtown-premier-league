
import { useTournament } from '@/context/TournamentContext';
import Image from '@/components/ui/image';

interface TeamLogoProps {
  teamId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TeamLogo = ({ teamId, size = 'md', className = '' }: TeamLogoProps) => {
  const { getTeamById } = useTournament();
  const team = getTeamById(teamId);

  
  if (!team) {
    return <div className="bg-gray-200 rounded-full animate-pulse"></div>;
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div 
      className={`relative flex items-center justify-center overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      <Image
        src={team.logo}
        alt={`${team.name} logo`}
        className="object-contain"
        width={64}
        height={64}
      />
    </div>
  );
};

export default TeamLogo;

