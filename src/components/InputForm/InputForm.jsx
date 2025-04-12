import { useState } from 'react'
import CurrencyInput from 'react-currency-input-field'
import { Controller } from 'react-hook-form'
import Select from 'react-select'

function InputForm ({
  name,
  control,
  label,
  type,
  error,
  readOnly,
  disabled,
  min,
  onFilterChange,
  max,
  defaultValue,
  step,
  required,
  estilos = 'col-12',
  options
}) {
  const intlConfig = {
    locale: 'en-US',
    currency: 'USD'
  }
  const [inputValue, setInputValue] = useState('')

  return type == 'checkbox' ? (
    <div className={`form-group ${estilos}`}>
      <div className='form-check'>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <div>
              <input
                {...field}
                type='checkbox'
                disabled={disabled}
                className='form-check-input'
                checked={field.value}
                onChange={e => field.onChange(e.target.checked)}
              />
            </div>
          )}
        />
        <label htmlFor={name} className='form-check-label'>
          {label}
        </label>
      </div>
    </div>
  ) : (
    <div
      className={`form-group ${
        error ? 'has-error has-feedback' : ''
      }  ${estilos}`}
    >
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        required={required}
        control={control}
        render={({ field }) =>
          type == 'moneda' ? (
            <CurrencyInput
              placeholder='Please enter a number'
              className='form-control'
              disabled={disabled}
              min={min}
              max={max}
              required={required}
              {...field}
              allowNegativeValue={false}
              readOnly={readOnly}
              step={1}
              decimalsLimit={2}
              allowDecimals={false}
            />
          ) : type == 'select-autocomplete' ? (
            <Select
            {...field}
            options={options}
            isDisabled={readOnly}
            isOptionDisabled={readOnly}
            isClearable
            placeholder='Seleccione una opción...'
            inputValue={inputValue}
            onInputChange={value => {
              setInputValue(value)
              onFilterChange(value) // Enviar el texto de filtro al padre
            }}
          />
          
          )
          : type == 'file' ? (
            <input
              {...field}
              value={field.value?.fileName}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              onChange={event => {
                field.onChange(event.target.files[0])
              }}
              className='form-control'
              type='file'
            />
          ) : (
            <input
              readOnly={readOnly}
              disabled={disabled}
              min={min}
              max={max}
              required={required}
              step={step}
              type={type}
              defaultValue={defaultValue}
              {...field}
              className='form-control'
            />
          )
        }
      />
      {error && (
        <small id='emailHelp' className='form-text text-muted'>
          {error?.message}
        </small>
      )}
    </div>
  )
}

export default InputForm
