import { useEffect, useState } from 'react'
import { Badge, ListGroup, Placeholder, ProgressBar } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import GenerateInputs from '../../components/GenerateInputs/GenerateInputs'
import InputForm from '../../components/InputForm/InputForm'
import { formatearMoneda } from '../../Fixes/formatter'
import { MENSAJE_DEFAULT } from '../../Fixes/messages'
import { Alerta } from '../../functions/alerts'
import { dameEventoApi } from '../../services/EventosService'
import { listarZonaApi } from '../../services/ZonasService'
import './PasarelaPage.css'

function PasarelaPage () {
  const { control, errors, reset, handleSubmit, getValues, watch } = useForm()
  const { idTitulo } = useParams()
  const [id, title] = idTitulo.split('-')
  const [Loading, setLoading] = useState(false)
  const [Evento, setEvento] = useState({})
  const [Zonas, setZonas] = useState([])
  useEffect(() => {
    setLoading(true)

    listarZonaApi(id, 'N', 9999).then(res => {
      setZonas(res.data.data)
      console.log(res.data.data)
    })
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

  const [selectedZona, setSelectedZona] = useState(null)

  const handleSelect = zonaId => {
    setSelectedZona(zonaId)
  }

  const datosPersonas = [
    {
      name: `DNI`,
      control: control,
      required: true,
      label: 'Documento',
      type: 'text',
      estilos: 'col-4',
      error: errors?.DNI
    },
    {
      required: true,
      name: `Apelname`,
      control: control,
      label: 'Nombre, Apellido',
      type: 'text',
      estilos: 'col-8',
      error: errors?.Apelname
    },
    {
      name: `Correo`,
      control: control,
      label: 'Correo electronico',
      required: true,
      type: 'email',
      estilo: 'col-6',
      error: errors?.Correo
    },
    {
      name: `Telefono`,
      control: control,
      label: 'Telefono',
      required: true,
      estilo: 'col-6',
      type: 'text',
      error: errors?.Telefono
    }
  ]

  const onSubmit = (data) => {
    console.log(data);
  };

  // Función para manejar el envío desde el botón externo
  const handleExternalSubmit = () => {
    handleSubmit(onSubmit)(); // Llama a handleSubmit y ejecuta la función onSubmit
  };



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
            minHeight: '800px',
            borderRadius: '12px',
            paddingTop: '2rem'
          }}
        >
          <div
            className='content-wrapper px-5'
            style={{ paddingBottom: '4rem' }}
          >
            <h2 className='text-center  fw-bold' style={{ color: '#6c5ce7' }}>
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
              </div>
            )}

            {pasoActual === 2 && (
              <div>
                <h4>Datos del Comprador</h4>
                <div className='row mt-5'>
                  <div className='col-7'>
                    <div className='fs-5 fw-bold mb-3'>Datos Personales</div>
                    <div className='row'>
                      <GenerateInputs
                        inputs={datosPersonas}
                        control={control}
                        errors={errors}
                        onlyView={false}
                      />
                    </div>
                  </div>

                  <div className='col-5'>
                    <div className='fs-5 fw-bold mb-3'>Zonas Disponibles</div>
                    <ListGroup as='ol' numbered>
                      {Zonas.map(zona => (
                        <ListGroup.Item
                          as='li'
                          key={zona.IdZona}
                          className={`d-flex justify-content-between align-items-start ${
                            selectedZona?.IdZona === zona.IdZona
                              ? 'text-white'
                              : ''
                          }`}
                          onClick={() => handleSelect(zona)}
                          style={{
                            cursor: 'pointer',
                            backgroundColor:
                              selectedZona?.IdZona === zona.IdZona
                                ? '#6c5ce7'
                                : ''
                          }} // Cambia el cursor al pasar sobre el elemento
                        >
                          <div className='ms-2 me-auto'>
                            <div className='fw-bold'>{zona.Zona}</div>
                            {zona.Detalle}
                            <p className='small mb-0 fw-bold'>
                              Disponible: {zona.Capacidad - zona.Ocupacion}
                            </p>
                          </div>
                          <Badge bg='primary' className='fs-6 my-auto'>
                            $ {formatearMoneda(zona.Precio)}
                          </Badge>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                    <div className='d-flex  align-items-center'>
                      <InputForm
                        control={control}
                        defaultValue={0}
                        error={errors?.Cantidad}
                        name={'Cantidad'}
                        min={1}
                        max={6}
                        type={'number'}
                        label={'Cantidad'}
                        estilos='w-25'
                      />
                      <div className=' ms-3 mt-4'>
                        <strong>
                          Importe total:{' '}
                          {formatearMoneda(
                            (watch('Cantidad') || 0) *
                              (selectedZona?.Precio || 0)
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {pasoActual === 3 && (
              <div className='mt-5'>
                <h4>Resumen</h4>
                <div className='resumen'>
                  <ul className='list-group list-group-flush my-3 fw-bold'>
                    <li className='list-group-item'>
                      Documento: {getValues('DNI')}
                    </li>
                    <li className='list-group-item'>
                      Nombre y apellido: {getValues('Apelname')}
                    </li>
                    <li className='list-group-item'>
                      Correo Electronico: {getValues('Correo')}
                    </li>
                    <li className='list-group-item'>
                      Telefono: {getValues('Telefono')}
                    </li>
                    <li className='list-group-item'>
                      Entrada {selectedZona.Zona}, Cantidad:{' '}
                      {getValues('Cantidad')}
                    </li>
                    <li className='list-group-item'>
                      Importe Total:{' '}
                      {formatearMoneda(
                        selectedZona.Precio * getValues('Cantidad')
                      )}
                    </li>
                  </ul>
                </div>
                <div className='comprobante mt-4'>
                  <h4>Sube tu Comprobante de Pago</h4>
                  <InputForm
                    control={control}
                    error={errors?.Archivo}
                    name={'Archivo'}
                    type={'file'}
                    label={''}
                  />
                </div>
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
              bottom: '2rem'
            }}
          >
            {pasoActual > 1 &&
              (pasoActual === totalPasos ? (
                ''
              ) : (
                <button
                  className='btn btn-secondary'
                  onClick={() => mostrarPaso(pasoActual - 1)}
                >
                  Atrás
                </button>
              ))}
            {pasoActual === totalPasos ? (
              ''
            ) : (
              <button
                className='btn btn-primary'
                disabled={
                  (pasoActual === 2 && !selectedZona) ||
                  (pasoActual === 2 &&
                    (!getValues('DNI') ||
                      !getValues('Correo') ||
                      !getValues('Telefono') ||
                      !getValues('Apelname'))) ||
                      (pasoActual === 3 && !watch('Archivo'))
                }
                onClick={() =>
                  pasoActual + 1 === totalPasos
                    ? handleExternalSubmit()
                    : mostrarPaso(
                        pasoActual < totalPasos ? pasoActual + 1 : pasoActual
                      )
                }
              >
                {pasoActual + 1 === totalPasos ? 'Finalizar' : 'Siguiente'}
              </button>
            )}
            {pasoActual === totalPasos ? (
              <button className='btn btn-primary'>Realizar otra compra</button>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasarelaPage
