interface ActionButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

const variantClasses = {
  primary: 'bg-gold text-felt-dark hover:bg-gold-light',
  secondary: 'bg-felt-light text-cream hover:bg-felt-light/80',
  danger: 'bg-casino-red text-cream hover:bg-casino-red/80',
};

export function ActionButton({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-3 font-semibold rounded-lg transition-colors min-h-11 min-w-11 ${
        disabled
          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
          : variantClasses[variant]
      }`}
    >
      {label}
    </button>
  );
}
