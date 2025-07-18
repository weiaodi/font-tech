import React from 'react';

export interface CardProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`monorepo-card ${className}`}>
      <div className="monorepo-card-title">{title}</div>
      <div className="monorepo-card-content">{children}</div>
    </div>
  );
};

export default Card;
