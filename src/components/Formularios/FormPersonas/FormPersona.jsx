import { useForm } from 'react-hook-form'
import GenerateInputs from '../../GenerateInputs/GenerateInputs'
import { Alerta } from '../../../functions/alerts'
import { MENSAJE_DEFAULT } from '../../../Fixes/messages'
import { useEffect } from 'react'
import Button from '../../Button/Button'
import InputPersonas from './InputPersonas'
import { storePersonasApi, updatePersonasApi } from '../../../services/PersonaService'

function FormPersona ({ dataform, soloVer, modificar, closeModal, refresh }) {
  const { control, errors, reset, handleSubmit } = useForm()

  useEffect(() => {
    if (dataform) reset(dataform)
  }, [reset, dataform])

  function onSubmit (data) {
    (modificar ? updatePersonasApi(data,dataform.IdPersona) :storePersonasApi(data))
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
              : 'Persona creada correctamente.'
          )
          .build()
      })
      .catch(error => {
        console.log(error)
        Alerta()
          .withMini(true)
          .withTipo('error')
          .withTitulo(`No se pudo crear la persona.`)
          .withMensaje(error.response.data.message ? error.response.data.message : MENSAJE_DEFAULT)
          .build()
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputPersonas control={control} errors={errors} onlyView={soloVer} />
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

export default FormPersona
