import Button from '../../components/Button/Button'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import SectionPage from '../../components/SectionPage/SectionPage'

function DashboardPage () {
  return (
    <div>
      <HeaderPageComponent title='Dashboard' items={[{name:'Dashboard',link:'/'}]}/>
      <SectionPage header={'Personas'}>
          <h3>Hola mundo</h3>
          <Button estilo='success' onClick={()=>console.log('test')}>Test</Button>
      </SectionPage>
    </div>
  )
}

export default DashboardPage
