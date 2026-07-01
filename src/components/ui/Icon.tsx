import React from "react";
import * as Icons from "lucide-react";

export type IconName = keyof typeof Icons;

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, className, size = 16, color, strokeWidth = 2 }: IconProps) {
  // Retrieve the component dynamically
  const LucideIcon = Icons[name] as React.ComponentType<any>;

  if (!LucideIcon) {
    console.warn(`Icon '${name}' does not exist in lucide-react.`);
    return <Icons.HelpCircle className={className} size={size} color={color} strokeWidth={strokeWidth} />;
  }

  return <LucideIcon className={className} size={size} color={color} strokeWidth={strokeWidth} />;
}

export default Icon;
