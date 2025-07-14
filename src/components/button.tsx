// components/CustomButton.tsx
import React from 'react';

interface CustomButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  className = '',
  style = {},
  type = 'button',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full text-white text-xl font-normal py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 ${className}`}
      style={style}
    >
      {label}
    </button>
  );
};

export default Button;
