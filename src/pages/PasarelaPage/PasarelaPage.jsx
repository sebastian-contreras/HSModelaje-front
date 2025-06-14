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
import { storeEntradaPasarelaApi } from '../../services/EntradasService'
import Button from '../../components/Button/Button'

function PasarelaPage() {
  const { control, errors, reset, handleSubmit, getValues, watch } = useForm()
  const { idTitulo } = useParams()
  const [id, title] = idTitulo.split('-')
  const [Loading, setLoading] = useState(false)
  const [Evento, setEvento] = useState({})
  const [LoadingFinal, setLoadingFinal] = useState(false)
  const [Zonas, setZonas] = useState([])

  useEffect(() => {
    setLoading(true)
    listarZonaApi(id, 'N', 9999).then(res => {
      setZonas(res.data.data)
    })
    
    dameEventoApi(id)
      .then(res => {
        if (!res.data.length) {
          Alerta()
            .withTipo('error')
            .withTitulo('Error al obtener el evento')
            .withMensaje('El evento no existe.')
            .withMini(true)
            .build()
          return
        } else {
          setEvento(res.data[0])
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
  const handleSelect = zonaId => setSelectedZona(zonaId)

  const datosPersonas = [
    {
      name: `DNI`,
      control: control,
      required: true,
      label: 'Documento',
      type: 'text',
      estilos: 'col-md-4 col-12',
      error: errors?.DNI
    },
    {
      required: true,
      name: `ApelName`,
      control: control,
      label: 'Nombre, Apellido',
      type: 'text',
      estilos: 'col-md-8 col-12',
      error: errors?.ApelName
    },
    {
      name: `Correo`,
      control: control,
      label: 'Correo electronico',
      required: true,
      type: 'email',
      estilos: 'col-md-6 col-12',
      error: errors?.Correo
    },
    {
      name: `Telefono`,
      control: control,
      label: 'Telefono',
      required: true,
      estilos: 'col-md-6 col-12',
      type: 'text',
      error: errors?.Telefono
    }
  ]

  useEffect(() => {
    if (pasoActual === 2) {
      listarZonaApi(id, 'N', 9999).then(res => {
        setZonas(res.data.data)
      })
    }
    if (pasoActual === 4) {
      document.title = 'Compra finalizada'
    } else {
      document.title = 'Comprar entradas'
    }
  }, [id, pasoActual])

  const onSubmit = data => {
    setLoadingFinal(true)
    const entrada = { ...data, IdZona: selectedZona.IdZona }
    storeEntradaPasarelaApi(entrada)
      .then(res => {
        setPasoActual(4)
        reset()
      })
      .catch(error => {
        Alerta()
          .withMini(true)
          .withTipo('error')
          .withTitulo(`Error al realizar la compra`)
          .withMensaje(
            error.response.data.message
              ? error.response.data.message
              : MENSAJE_DEFAULT
          )
          .build()
      })
      .finally(() => {
        setLoadingFinal(false)
      })
  }

  const handleExternalSubmit = () => {
    handleSubmit(onSubmit)()
  }

  if (Loading) return <Placeholder />

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <div className="card shadow-lg mb-5">
          <div className="card-body p-3 p-md-4 p-lg-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary">{Evento.Evento}</h2>
              <h3 className="fw-bold text-primary mb-3">Compra de Entradas</h3>
              <p className="text-muted">
                Asegura tu lugar en el evento seleccionando la zona y completando
                tu compra en pocos pasos.
              </p>
            </div>

            <div className="mb-4">
              <ProgressBar
                striped
                label={`Paso ${pasoActual} de 4`}
                variant="primary"
                className="fw-bold"
                style={{ height: '1.4rem', fontSize: '1.1rem' }}
                now={(pasoActual / totalPasos) * 100}
              />
            </div>

            {pasoActual === 1 && (
              <div>
                <h4 className="fw-normal mb-3">Información del Evento</h4>
                <p className="mb-4">
                  Selecciona la zona y revisa los precios antes de continuar con
                  la compra.
                </p>
                <div className="alert alert-light border">
                  El evento se llevará a cabo el <strong>15 de abril</strong> en
                  el <strong>Centro de Convenciones</strong>.
                </div>
              </div>
            )}

            {pasoActual === 2 && (
              <div className="row g-4">
                <div className="col-lg-7">
                  <h4 className="mb-4">Datos del Comprador</h4>
                  <div className="fs-5 fw-bold mb-3">Datos Personales</div>
                  <div className="row g-3">
                    <GenerateInputs
                      inputs={datosPersonas}
                      control={control}
                      errors={errors}
                      onlyView={false}
                    />
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="fs-5 fw-bold mb-3">Zonas Disponibles</div>
                  <ListGroup as="ol" numbered className="mb-4">
                    {Zonas.map(zona => {
                      const isAvailable = zona.Capacidad - zona.Ocupacion > 0
                      return (
                        <ListGroup.Item
                          as="li"
                          key={zona.IdZona}
                          className={`d-flex justify-content-between align-items-start ${
                            selectedZona?.IdZona === zona.IdZona
                              ? 'text-white bg-primary'
                              : ''
                          } ${!isAvailable ? 'text-muted bg-light' : ''}`}
                          onClick={() => isAvailable && handleSelect(zona)}
                          style={{
                            cursor: isAvailable ? 'pointer' : 'not-allowed'
                          }}
                        >
                          <div className="ms-2 me-auto">
                            <div className="fw-bold">{zona.Zona}</div>
                            {zona.Detalle}
                            <p className="small mb-0 fw-bold">
                              Disponible: {zona.Capacidad - zona.Ocupacion}
                            </p>
                          </div>
                          <Badge bg={isAvailable ? 'primary' : 'secondary'} className="fs-6 my-auto">
                            $ {formatearMoneda(zona.Precio)}
                          </Badge>
                        </ListGroup.Item>
                      )
                    })}
                  </ListGroup>
                  <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
                    <InputForm
                      control={control}
                      defaultValue={0}
                      error={errors?.Cantidad}
                      name={'Cantidad'}
                      min={1}
                      max={6}
                      type={'number'}
                      label={'Cantidad'}
                      estilos="w-auto"
                    />
                    <div className="mt-md-0 mt-2">
                      <strong>
                        Importe total:{' '}
                        {formatearMoneda(
                          (watch('Cantidad') || 0) * (selectedZona?.Precio || 0)
                        )}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {pasoActual === 3 && (
              <div>
                <h4 className="mb-4">Resumen</h4>
                <div className="resumen">
                  <ul className="list-group list-group-flush mb-4 fw-bold">
                    <li className="list-group-item">
                      Documento: {getValues('DNI')}
                    </li>
                    <li className="list-group-item">
                      Nombre y apellido: {getValues('ApelName')}
                    </li>
                    <li className="list-group-item">
                      Correo Electronico: {getValues('Correo')}
                    </li>
                    <li className="list-group-item">
                      Telefono: {getValues('Telefono')}
                    </li>
                    <li className="list-group-item">
                      Entrada {selectedZona.Zona}, Cantidad:{' '}
                      {getValues('Cantidad')}
                    </li>
                    <li className="list-group-item">
                      Importe Total:{' '}
                      {formatearMoneda(
                        selectedZona.Precio * getValues('Cantidad')
                      )}
                    </li>
                  </ul>
                </div>
                <div className="comprobante">
                  <h4 className="mb-3">Sube tu Comprobante de Pago</h4>
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
              <div className="text-center py-5">
                <h4 className="text-success mb-3">Compra Finalizada</h4>
                <p className="text-muted">
                  ¡Gracias por tu compra! Recibirás un correo con los detalles
                  de tus entradas.
                </p>
              </div>
            )}
          </div>

          <div className="card-footer bg-transparent border-0">
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              {pasoActual > 1 && pasoActual !== totalPasos && (
                <Button
                  variant="secondary"
                  onClick={() => mostrarPaso(pasoActual - 1)}
                >
                  Atrás
                </Button>
              )}
              
              {pasoActual !== totalPasos ? (
                <Button
                  variant="primary"
                  loading={LoadingFinal}
                  disabled={
                    (pasoActual === 2 && !selectedZona) ||
                    (pasoActual === 2 &&
                      (!getValues('DNI') ||
                        !getValues('Correo') ||
                        !getValues('Telefono') ||
                        !getValues('ApelName'))) ||
                    (pasoActual === 3 && !watch('Archivo'))
                  }
                  onClick={() =>
                    pasoActual + 1 === totalPasos
                      ? handleExternalSubmit()
                      : mostrarPaso(pasoActual + 1)
                  }
                >
                  {pasoActual + 1 === totalPasos ? 'Finalizar' : 'Siguiente'}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => {
                    reset()
                    setSelectedZona(null)
                    setPasoActual(1)
                  }}
                >
                  Realizar otra compra
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasarelaPage