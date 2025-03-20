import { useEffect, useState } from 'react'
import './PasarelaPage.css'
import { Padding } from '@mui/icons-material'
import { Badge, ListGroup, Placeholder, ProgressBar } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { MENSAJE_DEFAULT } from '../../Fixes/messages'
import { Alerta } from '../../functions/alerts'
import { dameEventoApi } from '../../services/EventosService'

function PasarelaPage () {
  const { idTitulo } = useParams()
  const [id, title] = idTitulo.split('-')
  const [Loading, setLoading] = useState(false)
  const [Evento, setEvento] = useState({})
  useEffect(() => {
    setLoading(true)
    dameEventoApi(id)
      .then(res => {
        if (!res.data.length) {
          console.log('entra')
          Alerta()
            .withTipo('error')
            .withTitulo('Error al obtener el evento')
            .withMensaje('El evento no existe.')
            .withMini(true)
            .build()
          return
        } else {
          setEvento(res.data[0]) // Guarda la información en el contexto
          console.log('fuarda evento')
          document.title = res.data[0].Evento + ' - Ventas de entradas'
        }
      })
      .catch(err => {
        Alerta()
          .withTipo('error')
          .withTitulo('Error al obtener el evento')
          .withMensaje(
            err?.response?.data?.message
              ? err.response.data.message
              : MENSAJE_DEFAULT
          )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  const [pasoActual, setPasoActual] = useState(1)
  const totalPasos = 4

  const mostrarPaso = paso => setPasoActual(paso)
  if (Loading) return <Placeholder />
  return (
    <div
      className=''
      style={{ backgroundColor: 'AliceBlue', minHeight: '100vh' }}
    >
      <div className='container' style={{ paddingTop: '3rem' }}>
        <div
          className='card shadow-lg d-flex  mb-5'
          style={{
            padding: '2rem',
            minHeight: '750px',
            borderRadius: '12px',
            paddingTop: '2rem'
          }}
        >
          <div
            className='content-wrapper px-5'
            style={{ paddingBottom: '4rem' }}
          >
            <h2
              className='text-center  fw-bold'
              style={{ color: '#6c5ce7' }}
            >
              {Evento.Evento}
            </h2>
            <h3
              className='text-center mb-4 fw-bold'
              style={{ color: '#6c5ce7' }}
            >
              Compra de Entradas
            </h3>
            <p className='text-center text-muted mt-2'>
              Asegura tu lugar en el evento seleccionando la zona y completando
              tu compra en pocos pasos.
            </p>
            <div className='mb-4 mt-5'>
              <ProgressBar
                striped
                label={`Paso ${pasoActual} de 4`}
                variant='primary'
                style={{
                  height: '1.4rem',
                  fontSize: '1.1rem',
                  fontStyle: 'bold'
                }}
                now={(pasoActual / totalPasos) * 100}
              />
            </div>

            {pasoActual === 1 && (
              <div>
                <h4 className='mt-4 fw-normal'>Información del Evento</h4>
                <p>
                  Selecciona la zona y revisa los precios antes de continuar con
                  la compra.
                </p>
                <div className='alert alert-light border'>
                  El evento se llevará a cabo el <strong>15 de abril</strong> en
                  el <strong>Centro de Convenciones</strong>.
                </div>
                <div className='mt-5'>
                  <div className='fs-5 fw-bold mb-3'>Zonas Disponibles</div>
                  <ListGroup as='ol' numbered>
                    <ListGroup.Item
                      as='li'
                      className='d-flex justify-content-between align-items-start'
                    >
                      <div className='ms-2 me-auto'>
                        <div className='fw-bold'>Subheading</div>
                        Cras justo odio
                      </div>
                      <Badge bg='primary' pill>
                        14
                      </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item
                      as='li'
                      className='d-flex justify-content-between align-items-start'
                    >
                      <div className='ms-2 me-auto'>
                        <div className='fw-bold'>Subheading</div>
                        Cras justo odio
                      </div>
                      <Badge bg='primary' pill>
                        14
                      </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item
                      as='li'
                      className='d-flex justify-content-between align-items-start'
                    >
                      <div className='ms-2 me-auto'>
                        <div className='fw-bold'>Subheading</div>
                        Cras justo odio
                      </div>
                      <Badge bg='primary' pill>
                        14
                      </Badge>
                    </ListGroup.Item>
                  </ListGroup>
                </div>
              </div>
            )}

            {pasoActual === 2 && (
              <div>
                <h4>Datos del Comprador</h4>
                <form>
                  <div className='mb-4'>
                    <label className='form-label'>Nombre Completo</label>
                    <input type='text' className='form-control' required />
                  </div>
                  <div className='mb-4'>
                    <label className='form-label'>Correo Electrónico</label>
                    <input type='email' className='form-control' required />
                  </div>
                </form>
              </div>
            )}

            {pasoActual === 3 && (
              <div>
                <h4>Sube tu Comprobante de Pago</h4>
                <input type='file' className='form-control mb-4' required />
              </div>
            )}

            {pasoActual === 4 && (
              <div className='text-center'>
                <h4 className='text-success'>Compra Finalizada</h4>
                <p className='text-muted'>
                  ¡Gracias por tu compra! Recibirás un correo con los detalles
                  de tus entradas.
                </p>
              </div>
            )}
          </div>
          <div
            className='mx-auto d-flex justify-content-center gap-5'
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: '2rem',
              padding: '2rem'
            }}
          >
            {pasoActual > 1 && (
              <button
                className='btn btn-secondary'
                onClick={() => mostrarPaso(pasoActual - 1)}
              >
                Atrás
              </button>
            )}
            <button
              className='btn btn-primary'
              onClick={() =>
                mostrarPaso(
                  pasoActual < totalPasos ? pasoActual + 1 : pasoActual
                )
              }
            >
              {pasoActual === totalPasos ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasarelaPage
