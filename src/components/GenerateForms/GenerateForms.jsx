import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { MENSAJE_DEFAULT } from '../../Fixes/messages'
import { Alerta } from '../../functions/alerts'
import Button from '../Button/Button'
import GenerateInputs from '../GenerateInputs/GenerateInputs'

function GenerateForms ({
  dataform,
  onlyView,
  modificar,
  closeModal,
  refresh,
  inputs = [],
  functionUpdate,
  functionCreate,
  id,
  elemento
}) {
  const { control, errors, reset, handleSubmit } = useForm()
  const esFemenino = (palabra) => {
    return palabra.endsWith('a'); // Asume que las palabras que terminan en "a" son femeninas
  };

  // Generar los mensajes de éxito y error dinámicamente
  const successMessage = esFemenino(elemento) 
    ? `${elemento} creada correctamente.` 
    : `${elemento} creado correctamente.`;

  const errorMessage = esFemenino(elemento) 
    ? `No se pudo crear la ${elemento}.` 
    : `No se pudo crear el ${elemento}.`;


  useEffect(() => {
    if (dataform) reset(dataform)
  }, [reset, dataform])
  const inputsTest = inputs.map(inputElement => ({
    name: inputElement.name,
    control: control,
    label: inputElement.label,
    type: inputElement.type,
    estilos: inputElement?.estilos,
    options: inputElement?.options,
    error: errors?.Evento,
    readOnly: onlyView
  }))

  console.log(inputsTest)

  function onSubmit (data) {
    ;(modificar ? functionUpdate(data, dataform[id]) : functionCreate(data))
      .then(response => {
        console.log(data)
        if (closeModal) closeModal()
        if (refresh) refresh()
        Alerta()
          .withMini(true)
          .withTipo('success')
          .withTitulo(
            response.message ? response.message : successMessage
          )
          .build()
      })
      .catch(error => {
        console.log(error)
        Alerta()
          .withMini(true)
          .withTipo('error')
          .withTitulo(errorMessage)
          .withMensaje(
            error.response.data.message
              ? error.response.data.message
              : MENSAJE_DEFAULT
          )
          .build()
      })
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <GenerateInputs
        inputs={inputsTest}
        control={control}
        errors={errors}
        onlyView={onlyView}
      />
      <div className='d-flex justify-content-end gap-3'>
        {closeModal && (
          <Button estilo='secondary' onClick={closeModal}>
            Cerrar
          </Button>
        )}
        {!onlyView && (
          <Button estilo='primary' type='submit'>
            Guardar
          </Button>
        )}
      </div>
    </form>
  )
}

export default GenerateForms
