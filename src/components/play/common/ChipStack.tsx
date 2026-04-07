interface ChipStackProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
};

function chipColor(amount: number): string {
  if (amount >= 100) return 'bg-gray-800 border-gray-600';
  if (amount >= 50) return 'bg-blue-700 border-blue-500';
  if (amount >= 25) return 'bg-green-700 border-green-500';
  if (amount >= 10) return 'bg-red-700 border-red-500';
  return 'bg-gray-100 border-gray-300 text-gray-800';
}

export function ChipStack({ amount, size = 'md' }: ChipStackProps) {
  return (
    <div
      className={`${sizeClasses[size]} rounded-full border-2 ${chipColor(amount)} flex items-center justify-center font-bold shadow-md`}
      aria-label={`${amount} chips`}
    >
      {amount}
    </div>
  );
}
