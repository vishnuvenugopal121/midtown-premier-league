
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
}

const Image = ({ className, src, alt, width, height, ...props }: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? '/placeholder.svg' : src}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        'transition-opacity duration-300',
        isLoading ? 'opacity-0' : 'opacity-100',
        className
      )}
      onLoad={() => setIsLoading(false)}
      onError={() => {
        setIsLoading(false);
        setError(true);
      }}
      {...props}
    />
  );
};

export default Image;

