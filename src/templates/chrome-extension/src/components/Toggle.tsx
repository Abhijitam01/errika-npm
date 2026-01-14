import React from 'react';
import './Toggle.css';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  id,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="ext-toggle">
      <input
        type="checkbox"
        id={toggleId}
        className="ext-toggle__input"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <label htmlFor={toggleId} className="ext-toggle__label">
        <span className="ext-toggle__switch">
          <span className="ext-toggle__slider" />
        </span>
        {label && <span className="ext-toggle__text">{label}</span>}
      </label>
    </div>
  );
};

