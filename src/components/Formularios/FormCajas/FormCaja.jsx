import { useForm } from 'react-hook-form'
import InputForm from '../../InputForm/InputForm'
import Button from '../../Button/Button'
import InputCaja from './InputCaja'
import { useEffect, useMemo } from 'react'
import { storeCajasApi, updateCajasApi } from '../../../services/CajasService'
import { Alerta } from '../../../functions/alerts'
import { MENSAJE_DEFAULT } from '../../../Fixes/messages'

function FormCaja ({ dataform, soloVer, modificar, closeModal, refresh }) {
  const { control, errors, reset, handleSubmit } = useForm()

  useEffect(() => {
    if (dataform) reset(dataform)
  }, [reset, dataform])

  function onSubmit (data) {
    (modificar ? updateCajasApi(data,dataform.IdCaja) :storeCajasApi(data))
      .then(response => {
        console.log(data)
        if(closeModal) closeModal()
          if(refresh) refresh()
        Alerta()
          .withMini(true)
          .withTipo('success')
          .withTitulo(
            response.message
              ? response.message
              : 'Caja creada correctamente.'
          )
          .build()
      })
      .catch(error => {
        console.log(error)
        Alerta()
          .withMini(true)
          .withTipo('error')
          .withTitulo(`No se pudo crear la caja.`)
          .withMensaje(error.response.data.message ? error.response.data.message : MENSAJE_DEFAULT)
          .build()
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputCaja control={control} errors={errors} onlyView={soloVer} />
      <div className='d-flex justify-content-end gap-3'>
        {closeModal && (
          <Button estilo='secondary' onClick={closeModal}>
            Cerrar
          </Button>
        )}
        {!soloVer && (
          <Button estilo='primary' type='submit'>
            Guardar
          </Button>
        )}
      </div>
    </form>
  )
}

export default FormCaja
