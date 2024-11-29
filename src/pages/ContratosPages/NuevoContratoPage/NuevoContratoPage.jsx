import { useEffect, useState } from 'react'
import HeaderPageComponent from '../../../components/HeaderPageComponent/HeaderPageComponent'
import SectionPage from '../../../components/SectionPage/SectionPage'
import { API_URL } from '../../../Fixes/API_URL.js'
import { useFetch } from '../../../hooks/useFetch'
import TablaCajas from '../../../components/TablaCajas/TablaCajas.jsx'
import InputPersonas from '../../../components/Formularios/FormPersonas/InputPersonas.jsx'
import { useForm } from 'react-hook-form'
import Button from '../../../components/Button/Button.jsx'
import { Accordion } from 'react-bootstrap'

function NuevoContratoPage () {
  const { control, errors, reset, handleSubmit } = useForm()
  const [cajasSeleccionadas, setCajasSeleccionadas] = useState({})
  const [Autorizados, setAutorizados] = useState([{}])
  useEffect(() => {
    console.log(cajasSeleccionadas)
  }, [cajasSeleccionadas])

  const agregarAutorizado = event => {
    event.stopPropagation() // Evita que el clic en este botón cierre el acordeón
    setAutorizados(prevAutorizados => [...prevAutorizados, {}])
  }
  const eliminarAutorizado = index => {
    console.log(index)
    setAutorizados(prevAutorizados =>
      prevAutorizados.filter((_, i) => i !== index)
    )
  }
  return (
    <div>
      <HeaderPageComponent
        title='Contratos'
        items={[{ name: 'Contratos', link: '/contratos' }]}
      />
      <SectionPage header={'Nuevo contrato'}>
        <div>
          <Accordion alwaysOpen>
            <Accordion.Item eventKey='caja'>
              <Accordion.Header>
                <b>Caja</b>
              </Accordion.Header>
              <Accordion.Body>
                <TablaCajas
                  select
                  rowSelection={cajasSeleccionadas}
                  setRowSelection={setCajasSeleccionadas}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='titulares'>
              <Accordion.Header>
                <b className='me-3'>Titulares</b>
                <Button sm estilo='primary' onClick={agregarAutorizado}>
                  +
                </Button>
              </Accordion.Header>
              <Accordion.Body>
                <Accordion alwaysOpen>
                  {Autorizados.map((autorizado, index) => (
                    <Accordion.Item
                      eventKey={`autorizado-${index}`}
                      key={index}
                    >
                      <Accordion.Header>
                        <b className='me-3'>Titular #{index + 1}</b>
                        <Button sm estilo='danger' onClick={() => eliminarAutorizado(index)}>
                          -
                        </Button>
                      </Accordion.Header>
                      <Accordion.Body>
                        <InputPersonas control={control} errors={errors} />
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='cuenta'>
              <Accordion.Header>
                <b>Datos varios de la cuenta</b>
              </Accordion.Header>
              <Accordion.Body></Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='pago'>
              <Accordion.Header>
                <b>Forma de pago</b>
              </Accordion.Header>
              <Accordion.Body></Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='roxbox'>
              <Accordion.Header>
                <b>Responsable Roxbox</b>
              </Accordion.Header>
              <Accordion.Body></Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='autorizados'>
              <Accordion.Header>
                <b>Autorizados/Acompañantes</b>
              </Accordion.Header>
              <Accordion.Body></Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </SectionPage>
    </div>
  )
}

export default NuevoContratoPage
