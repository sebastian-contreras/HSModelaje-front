import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { API_URL } from '../../../Fixes/API_URL'
import { SiONoOptions, VotacionOptions } from '../../../Fixes/fixes'
import { MENSAJE_DEFAULT } from '../../../Fixes/messages'
import { Alerta } from '../../../functions/alerts'
import { useFetch } from '../../../hooks/useFetch'
import {
  storeEventoApi,
  updateEventoApi
} from '../../../services/EventosService'
import Button from '../../Button/Button'
import GenerateInputs from '../../GenerateInputs/GenerateInputs'

function FormEventos ({ dataform, onlyView, modificar, closeModal, refresh }) {
  const { control, errors, reset, handleSubmit } = useForm()
  const {
    data: dataEstablecimientos,
    loading,
    error
  } = useFetch(`${API_URL}/api/establecimientos/`, 'get', {
    pIncluyeBajas: dataform ? 'S' : 'N',
  })

  useEffect(() => {
    if (dataform && !loading) {
      const itemFound = dataEstablecimientos?.find(
        item => item.IdEstablecimiento == dataform.IdEstablecimiento
      )
      reset({...dataform,IdEstablecimiento:{value:itemFound?.IdEstablecimiento,label:itemFound?.Establecimiento}})
    }
  }, [reset, dataform, dataEstablecimientos,loading])
  const inputsTest = [
    {
      name: `Evento`,
      control: control,
      label: 'Evento',
      type: 'text',
      error: errors?.Evento,
      readOnly: onlyView
    },
    {
      name: `FechaProbableInicio`,
      control: control,
      label: 'Fecha Probable Inicio',
      type: 'datetime-local',
      error: errors?.FechaProbableInicio,
      readOnly: onlyView
    },
    {
      name: `FechaProbableFinal`,
      control: control,
      label: 'Fecha Probable Final',
      type: 'datetime-local',
      error: errors?.FechaProbableFinal,
      readOnly: onlyView
    },
    {
      name: `Votacion`,
      control: control,
      label: '¿Votacion?',
      type: 'select',
      error: errors?.Votacion,
      estilos: 'col-12',
      options: VotacionOptions,
      readOnly: onlyView
    },
    {
      name: `IdEstablecimiento`,
      control: control,
      label: 'Establecimiento',
      type: 'select-autocomplete',
      error: errors?.IdEstablecimiento,
      estilos: 'col-12',
      options: dataEstablecimientos?.map(item => ({
        value: item.IdEstablecimiento,
        label: item.Establecimiento
      })),
      readOnly: onlyView
    }
  ]

  function onSubmit (data) {
    ;(modificar
      ? updateEventoApi({...data,IdEstablecimiento:data.IdEstablecimiento.value}, dataform.IdEvento)
      : storeEventoApi({...data,IdEstablecimiento:data.IdEstablecimiento.value})
    )
      .then(response => {
        console.log(data)
        if (closeModal) closeModal()
        if (refresh) refresh()
        Alerta()
          .withMini(true)
          .withTipo('success')
          .withTitulo(
            response.message ? response.message : 'Evento creado correctamente.'
          )
          .build()
      })
      .catch(error => {
        console.log(error)
        Alerta()
          .withMini(true)
          .withTipo('error')
          .withTitulo(`No se pudo crear el evento.`)
          .withMensaje(
            error.response.data.message
              ? error.response.data.message
              : MENSAJE_DEFAULT
          )
          .build()
      })
  }
  if (loading) return '...Cargando'
  if (error) return 'Error al cargar los datos, Contacte con el administrador'
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

export default FormEventos
