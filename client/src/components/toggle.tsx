export const Toggle = ({ onOff, toggled, property, id }) => (
  <div className="toggle">
    <input id={id} type="checkbox" checked={onOff} onChange={(e) => toggled(property)} />
    <label htmlFor={id}>Toggle</label>
  </div>
);