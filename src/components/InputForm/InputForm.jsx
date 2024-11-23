import { Controller } from 'react-hook-form'

function InputForm ({ name, control, label, type, error }) {
  return (
    <div className={`form-group ${error ? 'has-error has-feedback' : ''}`}>
      <label htmlFor={name}>{label}</label>
      <Controller name={name} control={control} 
      render={({field})=>
      <input
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
