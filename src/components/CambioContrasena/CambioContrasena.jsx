import React from 'react'
import { Alerta } from '../../functions/alerts'
import { MENSAJE_DEFAULT } from '../../Fixes/messages'
import { cambioContrasenaApi } from '../../services/UserService'
import { useForm } from 'react-hook-form'
import GenerateInputs from '../GenerateInputs/GenerateInputs'
import Button from '../Button/Button'

function CambioContrasena ({ closeModal }) {
  const { control, errors, reset, handleSubmit, watch } = useForm()

  function onSubmit (data) {
    cambioContrasenaApi(data)
      .then(response => {
        if (closeModal) closeModal()
        Alerta()
          .withMini(true)
          .withTipo('success')
          .withTitulo(
            response.message
              ? response.message
              : 'Se modifo la contraseña correctamente.'
          )
          .build()
      })
      .catch(error => {
        Alerta()
          .withMini(true)
          .withTipo('error')
          .withTitulo(`No se pudo modificar la contraseña.`)
          .withMensaje(
            error.response.data.message
              ? error.response.data.message
              : MENSAJE_DEFAULT
          )
          .build()
      })
  }
  const inputsTest = [
    {
      name: `ContrasenaActual`,
      control: control,
      label: 'Contraseña actual',
      type: 'password',
      estilos: 'col-12',
      error: errors?.ContrasenaActual,
      readOnly: false
    },
    {
      name: `Contrasena`,
      control: control,
      label: 'Contraseña nueva',
      type: 'password',
      error: errors?.Contrasena,
      readOnly: false
    },
    {
      name: `ContrasenaConfirmacion`,
      control: control,
      label: 'Confirmar contraseña',
      type: 'password',
      error: errors?.ContrasenaConfirmacion,
      readOnly: false,
    }
  ]
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <GenerateInputs inputs={inputsTest} />

        <div className='d-flex justify-content-end gap-3'>
          {closeModal && (
            <Button estilo='secondary' onClick={closeModal}>
              Cerrar
            </Button>
          )}
          <Button estilo='primary' type='submit'>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CambioContrasena
