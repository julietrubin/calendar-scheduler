import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}) => {
  // Define the base styles for all buttons
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  // Variant styles
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline:
      "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 hover:text-gray-900",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    ghost: "text-gray-600 hover:bg-gray-100",
  };

  // Size styles
  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3",
    lg: "h-12 px-6",
  };

  // Combine all classes
  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export { Button };
