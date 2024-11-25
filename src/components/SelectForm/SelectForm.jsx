import { Controller } from 'react-hook-form'

function SelectForm ({
  name,
  control,
  label,
  children,
  error,
  readonly,
  disabled,
  estilos = 'col-12',
  defaultValue
}) {
  return (
    <div
      className={`form-group ${
        error ? 'has-error has-feedback' : ''
      } ${estilos}`}
    >
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            defaultValue={defaultValue}
            disabled={disabled}
            readOnly={readonly}
            className='form-control'
          >
            {children}
          </select>
        )}
      />
      {error && (
        <small id='emailHelp' className='form-text text-muted'>
          {error?.message}
        </small>
      )}
    </div>
  )
}

export default SelectForm
