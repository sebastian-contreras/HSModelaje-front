import { Spinner } from "react-bootstrap"

function Button ({
  type = 'button',
  loading=false,
  estilo = 'primary',
  sm = false,
  onClick = () => {},
  disabled = false,
  style = {},
  lg = false,
  className = '',
  children
}) {
  const buttonClasses = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    success: 'btn btn-success',
    danger: 'btn btn-danger',
    warning: 'btn btn-warning',
    info: 'btn btn-info',
    light: 'btn btn-light',
    dark: 'btn btn-dark',
    link: 'btn btn-link'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      style={style}
      disabled={disabled || loading}
      className={`${buttonClasses[estilo]} ${sm ? 'btn-sm' : ''} ${
        lg ? 'btn-lg' : ''
      } ${className}`}
    >
      <Spinner hidden={!loading} size="sm" animation="border" className="me-2" />
      {children}
    </button>
  )
}

export default Button
