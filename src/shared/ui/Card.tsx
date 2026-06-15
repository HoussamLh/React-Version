import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  style,
}) => {
  return (
    <div
      style={style}
      className={`
        bg-[var(--bg-card)]
        border border-[var(--border-color)]
        rounded-[24px]
        p-7
        flex flex-col justify-between
        transition-all duration-300
        hover:-translate-y-2
        hover:border-[var(--accent-green)]
        hover:shadow-xl
        ${className}
      `}
    >
      {children}
    </div>
  );
};
