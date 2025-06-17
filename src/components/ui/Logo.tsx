import { Link } from "react-router-dom"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  }

  return (
    <Link to="/" className={`flex items-center space-x-2 ${className}`}>
      <img 
        src="/edupanelapp.webp" 
        alt="EduPanel Learning Hub Logo" 
        className={sizeClasses[size]}
      />
      {showText && (
        <span className="font-bold text-primary">EduPanel Learning Hub</span>
      )}
    </Link>
  )
} 