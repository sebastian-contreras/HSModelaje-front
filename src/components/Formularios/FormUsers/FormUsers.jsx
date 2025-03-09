import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { ROLES_CHOICES } from "../../../Fixes/fixes"
import { storeUsuarioApi, updateUsuarioApi } from "../../../services/UserService"
import { Alerta } from "../../../functions/alerts"
import { MENSAJE_DEFAULT } from "../../../Fixes/messages"
import GenerateInputs from "../../GenerateInputs/GenerateInputs"
import Button from "../../Button/Button"

function FormUsers ({ dataform, onlyView, modificar, closeModal, refresh }) {
  const { control, errors, reset, handleSubmit } = useForm()
  useEffect(() => {
    if (dataform) reset(dataform)
  }, [reset, dataform])
  const inputsTest = [
    {
      name: `Username`,
      control: control,
      label: 'Username',
      type: 'text',
      error: errors?.Username,
      readOnly: onlyView
    },
    {
      name: `Apellidos`,
      control: control,
      label: 'Apellidos',
      type: 'text',
      error: errors?.Apellidos,
      readOnly: onlyView
    },
    {
      name: `Nombres`,
      control: control,
      label: 'Nombres',
      type: 'text',
      error: errors?.Nombres,
      readOnly: onlyView
    },

    {
      name: `FechaNacimiento`,
      control: control,
      label: 'FechaNacimiento',
      type: 'date',
      error: errors?.FechaNacimiento,
      readOnly: onlyView
    },
    {
      name: `Email`,
      control: control,
      label: 'email',
      type: 'text',
      error: errors?.Email,
      readOnly: onlyView
    },
    {
      name: `Contrasena`,
      control: control,
      label: 'Contraseña',
      type: 'password',
      error: errors?.Contrasena,
      readOnly: onlyView || modificar
    },
    {
      name: `Telefono`,
      control: control,
      label: 'Telefono',
      type: 'text',
      error: errors?.Telefono,
      readOnly: onlyView
    },
    {
      name: `Rol`,
      control: control,
      label: 'Rol',
      type: 'select',
      error: errors?.Rol,
      estilos: 'col-12',
      options: ROLES_CHOICES,
      readOnly: onlyView
    }
  ]

  function onSubmit (data) {
    ;(modificar ? updateUsuarioApi(data, dataform.IdUsuario) : storeUsuarioApi(data))
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
              : 'Usuario creado correctamente.'
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

export default FormUsers
