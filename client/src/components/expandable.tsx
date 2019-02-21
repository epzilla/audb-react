import { FC, Props, useState } from 'react';

interface IExpandableProps extends Props<HTMLDivElement> {
  defaultCollapsed?: boolean;
  centered?: boolean;
  small?: boolean;
  title?: string;
  className?: string;
}

export const Expandable: FC<IExpandableProps> = ({ defaultCollapsed, centered, small, title, children }) => {

  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  let classes = collapsed ? 'expandable collapsed' : 'expandable';

  if (small) {
    classes += ' small';
  }

  if (centered) {
    classes += ' centered';
  }

  return (
    <div className={classes}>
      <div className="expandable-header">
        <h3><label htmlFor={`expandable-${title}`} >{title}</label></h3>
      </div>
      <input className="hidden-checkbox" checked={!collapsed} type="checkbox" id={`expandable-${title}`} onChange={toggle} />
      <div className="expandable-body">
        {children}
      </div>
      <label className="toggle-btn-label" htmlFor={`expandable-${title}`} ></label>
    </div>
  );
};