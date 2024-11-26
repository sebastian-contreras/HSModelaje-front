import { useForm } from 'react-hook-form'
import InputForm from '../../InputForm/InputForm'
import Button from '../../Button/Button'
import InputCaja from './InputCaja'
import { useEffect } from 'react'
import { storeCajasApi } from '../../../services/CajasService'
import { Alerta } from '../../../functions/alerts'
import { MENSAJE_DEFAULT } from '../../../Fixes/messages'

function FormCaja ({ dataform, soloVer, modificar, closeModal, refresh }) {
  const { control, errors, reset, handleSubmit } = useForm()

  useEffect(() => {
    if (dataform) reset(dataform)
  }, [reset, dataform])

  function onSubmit (data) {
    console.log(data)
    storeCajasApi(data)
      .then(response => {
        if(closeModal) closeModal()
          if(refresh) refresh()
        Alerta()
          .withMini(true)
          .withTipo('success')
          .withTitulo(
            response.message
              ? response.message
              : 'Credencial generada correctamente.'
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
