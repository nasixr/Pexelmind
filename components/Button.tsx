import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyles = "py-4 px-8 rounded-lg font-bold text-lg transition-all duration-200 focus:outline-none flex items-center justify-center gap-2 shadow-md";
  
  const variants = {
    primary: "bg-primary-900 text-white hover:bg-primary-800 active:bg-black border-2 border-transparent",
    secondary: "bg-accent-500 text-white hover:bg-green-800 border-2 border-transparent",
    outline: "bg-transparent text-primary-900 border-2 border-primary-900 hover:bg-primary-900 hover:text-white"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};