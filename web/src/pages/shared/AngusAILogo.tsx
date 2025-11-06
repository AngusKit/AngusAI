export function AngusAILogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'>
      {/* Background Circle */}
      <rect width='100' height='100' rx='20' fill='url(#gradient)' />

      {/* Letter A */}
      <path d='M50 25L30 70H40L43 62H57L60 70H70L50 25ZM46 54L50 42L54 54H46Z' fill='white' fillOpacity='0.95' />

      {/* AI Circuit Pattern */}
      <circle cx='75' cy='30' r='3' fill='white' fillOpacity='0.6' />
      <circle cx='25' cy='30' r='3' fill='white' fillOpacity='0.6' />
      <line x1='75' y1='30' x2='70' y2='35' stroke='white' strokeOpacity='0.4' strokeWidth='1.5' />
      <line x1='25' y1='30' x2='30' y2='35' stroke='white' strokeOpacity='0.4' strokeWidth='1.5' />

      {/* Gradient Definition */}
      <defs>
        <linearGradient id='gradient' x1='0' y1='0' x2='100' y2='100'>
          <stop offset='0%' stopColor='#3B82F6' />
          <stop offset='100%' stopColor='#1D4ED8' />
        </linearGradient>
      </defs>
    </svg>
  );
}
