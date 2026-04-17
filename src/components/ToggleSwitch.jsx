import './ToggleSwitch.css';

export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <div className="toggle-switch-container flex items-center justify-between">
      {label && <span className="toggle-label">{label}</span>}
      <label className="toggle-switch">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)} 
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
}
