import InputForm from '../InputForm/InputForm'
import SelectForm from '../SelectForm/SelectForm'

function GenerateInputs ({ inputs = [] }) {
  //{ name, control, label, type, error,readOnly,disabled,min,max,step, estilos, options }
  return (
    <div className='row'>
      {inputs.map((inputElement, index) =>
        inputElement.type == 'select' ? (
          <SelectForm
            defaultValue={inputElement.defaultValue }
            key={index}
            required={inputElement.required}
            disabled={inputElement.readOnly}
            {...inputElement}
          
          >
            <option value={null}></option>
            {inputElement?.options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectForm>
        ) : (
          <InputForm key={index} required={inputElement.required} {...inputElement} />
        )
      )}
    </div>
  )
}

export default GenerateInputs
