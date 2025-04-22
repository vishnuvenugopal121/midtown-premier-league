import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDateTime: string; // single ISO string like "2025-04-25T17:00:00"
}

const CountdownTimer = ({ targetDateTime }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDateTime);
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateTime]);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <div className="flex justify-center space-x-2 md:space-x-4">
      {timeUnits.map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="bg-cricket-primary bg-opacity-10 rounded-md p-2 md:p-3 min-w-[40px] md:min-w-[60px]">
            <span className="text-lg md:text-2xl font-bold text-gray-800">
              {String(unit.value).padStart(2, '0')}
            </span>
          </div>
          <div className="text-xs md:text-sm text-gray-600 mt-1">{unit.label}</div>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
