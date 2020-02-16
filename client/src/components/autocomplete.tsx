import React, { FC, useState } from "react";
import { debounce } from "../lib/helpers";
import { LVP } from "../lib/interfaces";

export interface IAutoCompleteProps {
  onSelect: Function;
  renderItem: Function;
  value: string;
  options: string[];
}

interface IAutoCompleteOption {
  val: string;
  highlighted: boolean;
}

export const Autocomplete: FC<IAutoCompleteProps> = ({
  onSelect,
  renderItem,
  options,
  value
}) => {
  const [matches, setMatches] = useState<IAutoCompleteOption[]>([]);
  const [currentValue, setCurrentValue] = useState(value || "");

  const debouncedChange = debounce((value: string) => {
    setCurrentValue(value);
    let lowerVal = value ? value.toLowerCase() : "";
    let m =
      value.length > 0
        ? options.filter(
            o => o.toLowerCase().indexOf(value.toLowerCase()) !== -1
          )
        : [];

    let superMatches: string[] = [];
    let normalMatches: string[] = [];
    m.forEach(item => {
      if (item.toLowerCase().startsWith(lowerVal)) {
        superMatches.push(item);
      } else {
        normalMatches.push(item);
      }
    });
    let autoMatches = superMatches.concat(normalMatches).map((m, i) => {
      return {
        val: m,
        highlighted: i === 0
      };
    });
    setMatches(autoMatches);
  }, 10);

  const onKeyUp = (e: React.KeyboardEvent) => {
    let value = (e.target as HTMLInputElement).value;
    let key = e.key;
    if (key === "ArrowDown") {
      let updatedMatches = [...matches];
      let i = updatedMatches.findIndex(m => m.highlighted);
      if (i !== -1) {
        updatedMatches[i].highlighted = false;
        if (updatedMatches.length > i + 1) {
          updatedMatches[i + 1].highlighted = true;
        } else if (updatedMatches.length > 1) {
          updatedMatches[0].highlighted = true;
        }
        e.preventDefault();
        setMatches(updatedMatches);
      }
    } else if (key === "ArrowUp") {
      let updatedMatches = [...matches];
      let i = updatedMatches.findIndex(m => m.highlighted);
      if (i !== -1) {
        updatedMatches[i].highlighted = false;
        if (updatedMatches.length > 1 && i === 0) {
          updatedMatches[updatedMatches.length - 1].highlighted = true;
        } else if (updatedMatches.length > 1) {
          updatedMatches[i - 1].highlighted = true;
        }
        e.preventDefault();
        setMatches(updatedMatches);
      }
    } else if (key === "Enter" || key === "Tab") {
      e.preventDefault();
      let h = matches.find(m => m.highlighted);
      if (h) {
        onSelect(h);
        setCurrentValue(h.val);
        setMatches([]);
      }
    } else if (key === "Escape") {
      e.preventDefault();
      setMatches([]);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    debouncedChange(val);
  };
  // const onKeyUp = debounce((e: React.KeyboardEvent) => {
  //   if (e.key === 'ArrowDown') {
  //     let updatedMatches = [ ...matches ];
  //     let i = updatedMatches.findIndex(m => m.highlighted);
  //     if (i !== -1) {
  //       updatedMatches[i].highlighted = false;
  //       if (updatedMatches.length > i + 1) {
  //         updatedMatches[i + 1].highlighted = true;
  //       }
  //       else if (updatedMatches.length > 1) {
  //         updatedMatches[0].highlighted = true;
  //       }
  //       e.preventDefault();
  //       setMatches(updatedMatches);
  //     }
  //   }
  //   else if (e.key === 'ArrowUp') {
  //     let updatedMatches = [...matches];
  //     let i = updatedMatches.findIndex(m => m.highlighted);
  //     if (i !== -1) {
  //       updatedMatches[i].highlighted = false;
  //       if (updatedMatches.length > 1 && i === 0) {
  //         updatedMatches[updatedMatches.length - 1].highlighted = true;
  //       }
  //       else if (updatedMatches.length > 1) {
  //         updatedMatches[i - 1].highlighted = true;
  //       }
  //       e.preventDefault();
  //       setMatches(updatedMatches);
  //     }
  //   }
  //   else if (e.key === 'Enter' || e.key === 'Tab') {
  //     let h = matches.find(m => m.highlighted);
  //     if (h) {
  //       onSelect(h);
  //     }
  //   }
  //   else if (e.key === 'Escape') {
  //     setMatches([]);
  //   }
  //   else {
  //     setCurrentValue((e.target as HTMLInputElement).value);
  //     let m = currentValue.length > 1 ? options.filter(o => o.toLowerCase().indexOf(currentValue.toLowerCase()) !== -1) : [];
  //     let autoMatches = m.map((m, i) => {
  //       return {
  //         val: m,
  //         highlighted: i === 0
  //       };
  //     });
  //     setMatches(autoMatches);
  //   }
  // }, 10);

  const onFocus = e => {
    e.target.select();
  };

  const onBlur = e => {
    let value = e.target.value;
    setMatches([]);
    if (onSelect && value !== value) {
      onSelect({ val: value, fromBlur: true });
    }
  };

  return (
    <div className="autocomplete">
      <input
        type="text"
        value={currentValue}
        onChange={onChange}
        onKeyUp={onKeyUp}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {matches && matches.length > 0 ? (
        <ul className="options-dropdown">
          {matches.map(m => (
            <li onClick={() => onSelect(m)}>{renderItem(m)}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
