
import React from 'react';
import { Cpu, Lightbulb, AirVent } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeviceIconProps {
  powered: boolean;
  size?: number;
  className?: string;
}

export const PowerIcon = ({ powered, size = 24, className }: DeviceIconProps) => (
  <Cpu 
    size={size} 
    className={cn(
      'lab-icon', 
      powered ? 'lab-icon-on' : 'lab-icon-off',
      className
    )} 
  />
);

export const LightingIcon = ({ powered, size = 24, className }: DeviceIconProps) => (
  <Lightbulb 
    size={size} 
    className={cn(
      'lab-icon', 
      powered ? 'lab-icon-on' : 'lab-icon-off',
      className
    )} 
  />
);

export const AcIcon = ({ powered, size = 24, className }: DeviceIconProps) => (
  <AirVent 
    size={size} 
    className={cn(
      'lab-icon', 
      powered ? 'lab-icon-on' : 'lab-icon-off',
      className
    )} 
  />
);
