interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export const Logo = ({ className = '', showText = true, variant = 'dark' }: LogoProps) => {
  const fillColor = variant === 'dark' ? '#000000' : '#FFFFFF';
  const textColor = variant === 'dark' ? 'text-black' : 'text-white';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <path
          d="M30 20 L50 10 L70 20 L70 35 L50 45 L30 35 Z M30 45 L50 35 L70 45 L70 60 L50 70 L30 60 Z M30 70 L50 60 L70 70 L70 85 L50 95 L30 85 Z"
          fill={fillColor}
        />
        <path
          d="M25 20 L25 85 M75 20 L75 85"
          stroke={fillColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <div className={`font-bold ${textColor}`}>
          <div className="text-xl leading-tight">Design</div>
          <div className="text-xl leading-tight">Ladder</div>
        </div>
      )}
    </div>
  );
};
