import { Link } from 'react-router-dom';
import './Button.css';

export default function Button({ to, children, variant = 'primary', glow = false, className = '', onClick }) {
  const classes = `sb-button ${variant} ${glow ? 'glow' : ''} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
