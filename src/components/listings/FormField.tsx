import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  children: ReactNode;
  className?: string;
  suffix?: string;
}

export function FormField({ label, children, className = "", suffix }: FormFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-caption text-muted-foreground font-medium">{label}</label>
      <div className="flex items-center gap-2">
        {children}
        {suffix && <span className="text-caption text-muted-foreground shrink-0">{suffix}</span>}
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function SectionHeader({ title, icon, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {action}
    </div>
  );
}
