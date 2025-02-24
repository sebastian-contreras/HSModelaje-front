import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { MENSAJE_DEFAULT } from "../../../Fixes/messages"
import { Alerta } from "../../../functions/alerts"
import Button from "../../Button/Button"
import GenerateInputs from "../../GenerateInputs/GenerateInputs"
import { storeEstablecimientoApi, updateEstablecimientoApi } from "../../../services/EstablecimientosService"

function FormEstablecimientos ({ dataform, onlyView, modificar, closeModal, refresh }) {
  const { control, errors, reset, handleSubmit } = useForm()
  useEffect(() => {
    if (dataform) reset(dataform)
  }, [reset, dataform])
  const inputsTest = [
    {
      name: `Establecimiento`,
      control: control,
      label: 'Establecimiento',
      type: 'text',
      error: errors?.Establecimiento,
      readOnly: onlyView
    },
    {
      name: `Ubicacion`,
      control: control,
      label: 'Ubicacion',
      type: 'text',
      error: errors?.Ubicacion,
      readOnly: onlyView
    },
    {
      name: `Capacidad`,
      control: control,
      label: 'Capacidad',
      type: 'text',
      error: errors?.Capacidad,
      readOnly: onlyView
    },
  ]

  function onSubmit (data) {
    ;(modificar ? updateEstablecimientoApi(data, dataform.IdEstablecimiento) : storeEstablecimientoApi(data))
      .then(response => {
        console.log(data)
        if (closeModal) closeModal()
        if (refresh) refresh()
        Alerta()
          .withMini(true)
          .withTipo('success')
          .withTitulo(
            response.message
              ? response.message
              : 'Establecimiento creado correctamente.'
          )
          .build()
      })
      .catch(error => {
        console.log(error)
        Alerta()
          .withMini(true)
          .withTipo('error')
          .withTitulo(`No se pudo crear el usuario.`)
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

export default FormEstablecimientos
