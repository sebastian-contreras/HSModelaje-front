import { Controller } from 'react-hook-form'

function InputForm ({ name, control, label, type, error,readOnly,disabled,min,max,step, estilos='col-12' }) {
  return (
    <div className={`form-group ${error ? 'has-error has-feedback' : ''}  ${estilos}`}>
      <label htmlFor={name}>{label}</label>
      <Controller name={name} control={control} 
      render={({field})=>
      <input
      readOnly={readOnly}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
        type={type}
        {...field}
        className='form-control'
      />
      }/>
      {error && (
        <small id='emailHelp' className='form-text text-muted'>
          {error?.message}
        </small>
      )}
    </div>
  )
}

export default InputForm
