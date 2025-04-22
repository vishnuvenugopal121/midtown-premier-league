
import { Check, X } from "lucide-react";

interface MatchResultIconProps {
  isWin: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const MatchResultIcon = ({ isWin, size = 'md' }: MatchResultIconProps) => {
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const iconSize = sizeMap[size];

  if (isWin) {
    return (
      <div className="rounded-full bg-green-100 p-0.5">
        <Check className="text-green-600" size={iconSize} />
      </div>
    );
  }

  return (
    <div className="rounded-full bg-red-100 p-0.5">
      <X className="text-red-600" size={iconSize} />
    </div>
  );
};

export default MatchResultIcon;
