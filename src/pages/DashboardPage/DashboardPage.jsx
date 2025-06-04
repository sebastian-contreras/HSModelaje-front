import { z } from 'zod'
import Button from '../../components/Button/Button'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import InputForm from '../../components/InputForm/InputForm'
import SectionPage from '../../components/SectionPage/SectionPage'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ModalModificado from '../../components/Modal/ModalModificado'
import { useEffect, useState } from 'react'
import GenerateInputs from '../../components/GenerateInputs/GenerateInputs'
import InputPersonas from '../../components/Formularios/FormPersonas/InputPersonas'
import Pusher from 'pusher-js'
import Echo from 'laravel-echo'
import { echo } from '../../config/EchoConfig'

const schema = z.object({
  name: z
    .string()
    .min(5, 'El nombre tiene que tener mas de 5 caracteres.')
    .nonempty({ message: 'El nombre es requerido.' }),
  test: z
    .string()
    .min(5, 'El nombre tiene que tener mas de 5 caracteres.')
    .nonempty({ message: 'El test es requerido.' })
})



function DashboardPage () {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(schema), mode: 'onBlur' })

  useEffect(() => {
    const channel = echo.channel('test-channel')
    console.log('Conectado al canal de votación')
    channel.listen('TestEvent', data => {
      console.log('Nuevo voto recibido:', data)
    })

    return () => {
      echo.leaveChannel('test-channel')
    }
  }, [])

  const [Modal, setModal] = useState(false)
  return (
    <>
      <div>
        <HeaderPageComponent
          title='Dashboard'
          items={[{ name: 'Dashboard', link: '/' }]}
        />
        <SectionPage header={'Dashboard'}>
          <h3>Hola mundo</h3>
          <InputPersonas control={control} errors={errors} />
          <InputForm
            control={control}
            error={errors?.name}
            name='name'
            type='text'
            label='Nombre'
          />
          <Button estilo='success' type='submit' onClick={() => setModal(true)}>
            Test
          </Button>
        </SectionPage>
      </div>
      <ModalModificado show={Modal} handleClose={() => setModal(false)}>
        <InputPersonas onlyView={true} />
      </ModalModificado>
    </>
  )
}

export default DashboardPage
