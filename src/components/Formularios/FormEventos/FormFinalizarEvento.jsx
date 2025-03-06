import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { MENSAJE_DEFAULT } from '../../../Fixes/messages'
import { Alerta } from '../../../functions/alerts'
import Button from '../../Button/Button'
import GenerateInputs from '../../GenerateInputs/GenerateInputs'
import {
  storeEstablecimientoApi,
  updateEstablecimientoApi
} from '../../../services/EstablecimientosService'
import {
    finalizarEventoApi,
  storeEventoApi,
  updateEventoApi
} from '../../../services/EventosService'
import { SiONoOptions } from '../../../Fixes/fixes'
import { API_URL } from '../../../Fixes/API_URL'
import { useFetch } from '../../../hooks/useFetch'

function FormFinalizarEvento ({ IdEvento,dataform, onlyView, modificar, closeModal, refresh }) {
  const { control, errors, reset, handleSubmit } = useForm()

  useEffect(() => {
    if (dataform) reset(dataform)
  }, [reset, dataform])
  const inputsTest = [
    {
      name: `pFechaInicio`,
      control: control,
      label: 'FechaInicio',
      type: 'datetime-local',
      error: errors?.FechaInicio,
      readOnly: onlyView
    },
    {
      name: `pFechaFinal`,
      control: control,
      label: 'FechaFinal',
      type: 'datetime-local',
      error: errors?.FechaFinal,
      readOnly: onlyView
    }
  ]
  console.log(dataform)

  function onSubmit (data) {
    finalizarEventoApi({...data,IdEvento:IdEvento}).then(response => {
        console.log(data)
        if (closeModal) closeModal()
        if (refresh) refresh()
        Alerta()
          .withMini(true)
          .withTipo('success')
          .withTitulo(
            response.message ? response.message : 'Evento finalizado correctamente.'
          )
          .build()
      })
      .catch(error => {
        console.log(error)
        Alerta()
          .withMini(true)
          .withTipo('error')
          .withTitulo(`No se pudo finalizar el evento.`)
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

export default FormFinalizarEvento
