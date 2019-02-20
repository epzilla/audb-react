import { FC, useState } from 'react';
import { debounce } from '../lib/helpers';
import { LVP } from '../lib/interfaces';

export interface IAutoCompleteProps {
  onSelect: Function;
  renderItems: Function;
  value: string;
  options: string[];
}

export const Autocomplete: FC<IAutoCompleteProps> = ({ onSelect, renderItems, options, value }) => {

  const [matches, setMatches] = useState([]);
  const [currentValue, setCurrentValue] = useState(value || '');

  const onKeyUp = debounce(e => {
    if (e.key === 'ArrowDown') {
      let updatedMatches = [ ...matches ];
      let i = updatedMatches.findIndex(m => m.highlighted);
      if (i !== -1) {
        updatedMatches[i].highlighted = false;
        if (updatedMatches.length > i + 1) {
          updatedMatches[i + 1].highlighted = true;
        }
        else if (updatedMatches.length > 1) {
          updatedMatches[0].highlighted = true;
        }
        e.preventDefault();
        setMatches(updatedMatches);
      }
    }
    else if (e.key === 'ArrowUp') {
      let updatedMatches = [...matches];
      let i = updatedMatches.findIndex(m => m.highlighted);
      if (i !== -1) {
        updatedMatches[i].highlighted = false;
        if (updatedMatches.length > 1 && i === 0) {
          updatedMatches[updatedMatches.length - 1].highlighted = true;
        }
        else if (updatedMatches.length > 1) {
          updatedMatches[i - 1].highlighted = true;
        }
        e.preventDefault();
        setMatches(updatedMatches);
      }
    }
    else if (e.key === 'Enter' || e.key === 'Tab') {
      let h = matches.find(m => m.highlighted);
      if (h) {
        this.select(h);
      }
    }
    else if (e.key === 'Escape') {
      setMatches([]);
    }
    else {
      setCurrentValue(e.target.value);
      let m = currentValue.length > 1 ? options.filter(o => o.toLowerCase().indexOf(currentValue.toLowerCase()) !== -1) : [];
      m = m.map((m, i) => {
        return {
          val: m,
          highlighted: i === 0
        };
      });
      setMatches(m);
    }
  }, 10);

  const onFocus = (e) => {
    e.target.select();
  };

  const onBlur = (e) => {
    let value = e.target.value;
    this.setState({ matches: [] });
    if (onSelect && value !== value) {
      onSelect({ val: value, fromBlur: true });
    }
  };

  return (
    <div className="autocomplete">
      <input
        type="text"
        value={currentValue}
        onKeyUp={onKeyUp}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {
        matches && matches.length > 0 ?
          (
            <ul className="options-dropdown">
              {renderItems(matches)}
            </ul>
          )
          : null
      }
    </div>
  );
};