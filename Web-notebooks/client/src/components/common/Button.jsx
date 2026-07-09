const Button = ({
  text,
  children,
  icon,
  variant = "primary",
  onClick,
  type = "button",
  size,
  disabled,
  as: As,
  to,
  className = "",
}) => {
  const classes = `custom-btn ${variant} ${size === "sm" ? "sm" : ""} ${className}`;

  if (As) {
    return (
      <As to={to} className={classes}>
        {icon && <span className="btn-icon">{icon}</span>}
        <span>{text || children}</span>
      </As>
    );
  }

  return (
    <button className={classes} onClick={onClick} type={type} disabled={disabled}>
      {icon && <span className="btn-icon">{icon}</span>}
      <span>{text || children}</span>
    </button>
  );
};

export default Button;
