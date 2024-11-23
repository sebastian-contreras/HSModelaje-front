import { z } from 'zod'
import Button from '../../components/Button/Button'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import InputForm from '../../components/InputForm/InputForm'
import SectionPage from '../../components/SectionPage/SectionPage'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  name: z.string().min(5, 'El nombre es obligatorio.')
})
function DashboardPage () {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(schema), mode: 'onBlur' })

  console.log(errors)
  return (
    <div>
      <HeaderPageComponent
        title='Dashboard'
        items={[{ name: 'Dashboard', link: '/' }]}
      />
      <SectionPage header={'Personas'}>
        <h3>Hola mundo</h3>
        <InputForm
          control={control}
          error={errors?.name}
          name="name"
          type="text"
          label="Nombre"
        />
        <Button
          estilo='success'
          type='submit'
          onClick={() => console.log('test')}
        >
          Test
        </Button>
      </SectionPage>
    </div>
  )
}

export default DashboardPage
