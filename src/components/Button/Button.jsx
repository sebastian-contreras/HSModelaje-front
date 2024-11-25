function Button({type='button',estilo='primary',sm=false,onClick=()=>{},style={},lg=false,children}) {
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
    };

  return (
    <button type={type} onClick={onClick} style={style}  className={`${buttonClasses[estilo]} ${sm ? 'btn-sm' : ''} ${lg ? 'btn-lg' : ''}`}>{children}</button>

  )
}

export default Button