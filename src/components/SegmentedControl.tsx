import React, { FC } from 'react';
import { LVP } from '../lib/interfaces';

interface ISegmentedControlProps {
  options: LVP[];
  onChange: (value: any) => void;
  value: any;
}

export const SegmentedControl: FC<ISegmentedControlProps> = ({ options, onChange, value }) => {

  const onKeyup = (e) => {
    if (e.target.nodeName === 'BUTTON' && (e.key === 'Enter' || e.key === 'Space')) {
      e.preventDefault();
      e.stopPropagation();
      onClick(e.target.dataset('value'));
    }
  };

  const onClick = (value) => {
    onChange(value);
  };

  return (
    <div className="segmented-control" onKeyUp={onKeyup}>
      {
        options.map(opt => (
          <button
            key={opt.value}
            className={`btn${opt.value === value ? ' selected' : ''}`}
            onClick={(e) => onClick(opt.value)}>
            {opt.label}
          </button>
        ))
      }
    </div>
  );
};