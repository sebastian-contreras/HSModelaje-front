import {
  faArrowRight,
  faCalendar,
  faCircleCheck,
  faHourglassStart,
  faLocationDot,
  faPerson,
  faShare,
  faStar
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  LinearProgress,
  Typography
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Badge, Button, Spinner } from 'react-bootstrap'
import { dameEstablecimientoApi } from '../../services/EstablecimientosService'
import { useParams } from 'react-router-dom'
import { dameTokenJuezApi } from '../../services/JuecesService'
import { dameEventoApi } from '../../services/EventosService'
import { formatearFechayHora } from '../../Fixes/formatter'
import { listarMetricaApi } from '../../services/MetricasService'
import { echo } from '../../config/EchoConfig'
import {
  enviarVotacionJuezApi,
  ParticipanteActivoApi
} from '../../services/VotacionService'
import { Alerta } from '../../functions/alerts'
import { MENSAJE_DEFAULT } from '../../Fixes/messages'

const calcularEdad = fecha => {
  const hoy = new Date()
  const nacimiento = new Date(fecha)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }

  return edad
}
export default function VotoJurado () {
  const [currentScreen, setCurrentScreen] = useState('welcome')
  const [Error, setError] = useState(null)
  const [votes, setVotes] = useState({})
  const { token } = useParams()
  const [JuezData, setJuezData] = useState(null)
  const [EventoData, setEventoData] = useState(null)
  const [EstablecimientoData, setEstablecimientoData] = useState(null)
  const [MetricaData, setMetricaData] = useState([])
  const [Loading, setLoading] = useState(false)
  const [ParticipanteActivo, setParticipanteActivo] = useState(null)
  const currentScreenRef = useRef(currentScreen)
  useEffect(() => {
    currentScreenRef.current = currentScreen
  }, [currentScreen])

  const handleVote = (metricId, score) => {
    setVotes(prev => ({ ...prev, [metricId]: score }))
  }

  const handleSubmit = () => {
    const formattedVotes = Object.entries(votes).map(([metricId, score]) => ({
      IdMetrica: metricId,
      Nota: score
    }))

    const payload = {
      IdEvento: EventoData.IdEvento,
      IdParticipante: ParticipanteActivo.IdParticipante,
      IdJuez: JuezData.IdJuez,
      votos: formattedVotes
    }

    enviarVotacionJuezApi(payload)
      .then(res => {
        setCurrentScreen('success')
      })
      .catch(err => {
        console.log(err)
        Alerta()
          .withMini(true)
          .withTipo('error')
          .withTitulo('Error al enviar la evaluación')
          .withMensaje(
            err?.response?.data?.message
              ? err.response.data.message
              : MENSAJE_DEFAULT
          )
      })
  }

  const isAllVoted = MetricaData?.every(
    metric => votes[metric.IdMetrica] !== undefined
  )

  useEffect(() => {
    if (!token) return

    let channel

    const cargarDatos = async () => {
      setLoading(true)
      try {
        const res = await dameTokenJuezApi(token)
        const juez = res.data?.[0]
        if (!juez) {
          setError('Token inválido o expirado')
          setLoading(false)
          return
        }

        setJuezData(juez)

        const [metricRes, eventRes] = await Promise.all([
          listarMetricaApi(juez.IdEvento),
          dameEventoApi(juez.IdEvento)
        ])

        setMetricaData(metricRes.data)
        const evento = eventRes.data?.[0]
        setEventoData(evento)

        if (evento?.IdEstablecimiento) {
          const estRes = await dameEstablecimientoApi(evento.IdEstablecimiento)
          setEstablecimientoData(estRes.data?.[0])
        }
        ParticipanteActivoApi(evento?.IdEvento).then(res => {
          console.log(res)
          if (res.data.length) {
            setParticipanteActivo(res.data[0])
            setCurrentScreen('evaluation')
          }
        })

        channel = echo.channel('evento-' + juez.IdEvento)

        channel.listen('VotoModeloIniciado', data => {
          console.log('Participante recibido desde WebSocket:', data)
          if (data.accion === 'iniciar') {
            setVotes({})
            setParticipanteActivo(data.participante)
            setCurrentScreen('evaluation')
          } else if (data.accion === 'detener') {
            if (currentScreenRef.current == 'evaluation') {
              setCurrentScreen('welcome')
            }
          }
        })
      } catch (err) {
        console.error(err)
        setError('Error al obtener los datos del juez')
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()

    return () => {
      if (channel) {
        channel.stopListening('VotoModeloIniciado')
        echo.leave('evento-' + EventoData?.IdEvento)
      }
    }
  }, [token, EventoData?.IdEvento])

  if (Error) {
    return <div>Error: {Error}</div>
  }

  if (Loading) {
    return (
      <Box className='min-vh-100 d-flex align-items-center justify-content-center bg-light p-3'>
        <Card sx={{ width: '100%', maxWidth: 400, textAlign: 'center', p: 2 }}>
          <Spinner animation='border' role='status' />
        </Card>
      </Box>
    )
  }

  if (EventoData?.Votacion === 'F') {
    return (
      <Box className='min-vh-100 d-flex align-items-center justify-content-center bg-light p-3'>
        <Card sx={{ width: '100%', maxWidth: 400, textAlign: 'center', p: 2 }}>
          <CardHeader
            avatar={
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'primary.main',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto'
                }}
              >
                <FontAwesomeIcon
                  icon={faStar}
                  style={{ width: '32px', height: '32px' }}
                />
              </Box>
            }
            title={
              <Typography variant='h6'>
                ¡Bienvenido al {EventoData?.Evento}!
              </Typography>
            }
            subheader='Evaluación de Modelos'
          />
          <CardContent>
            <Box sx={{ textAlign: 'left', mb: 2 }}>
              <Typography
                variant='body2'
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <FontAwesomeIcon icon={faCalendar} className='me-2' />{' '}
                {formatearFechayHora(EventoData?.FechaProbableInicio)}
              </Typography>
              <Typography
                variant='body2'
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <FontAwesomeIcon icon={faLocationDot} className='me-2' />{' '}
                {EstablecimientoData?.Establecimiento} -{' '}
                {EstablecimientoData?.Ubicacion}
              </Typography>
              <Typography
                variant='body2'
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <FontAwesomeIcon icon={faPerson} className='me-2' />{' '}
                {JuezData?.ApelName}
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: 'primary.light',
                p: 2,
                pt: 1,
                borderRadius: 2,
                textAlign: 'left'
              }}
            >
              <Typography
                variant='body2'
                mt={1}
                color='primary.contrastText'
                fontWeight={'bold'}
              >
                La votacion ha finalizado, Muchas gracias por su participacion
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    )
  }

  if (currentScreen === 'welcome') {
    return (
      <Box className='min-vh-100 d-flex align-items-center justify-content-center bg-light p-3'>
        <Card sx={{ width: '100%', maxWidth: 400, textAlign: 'center', p: 2 }}>
          <CardHeader
            avatar={
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'primary.main',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto'
                }}
              >
                <FontAwesomeIcon
                  icon={faStar}
                  style={{ width: '32px', height: '32px' }}
                />
              </Box>
            }
            title={
              <Typography variant='h6'>
                ¡Bienvenido al {EventoData?.Evento}!
              </Typography>
            }
            subheader='Evaluación de Modelos'
          />
          <CardContent>
            <Box sx={{ textAlign: 'left', mb: 2 }}>
              <Typography
                variant='body2'
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <FontAwesomeIcon icon={faCalendar} className='me-2' />{' '}
                {formatearFechayHora(EventoData?.FechaProbableInicio)}
              </Typography>
              <Typography
                variant='body2'
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <FontAwesomeIcon icon={faLocationDot} className='me-2' />{' '}
                {EstablecimientoData?.Establecimiento} -{' '}
                {EstablecimientoData?.Ubicacion}
              </Typography>
              <Typography
                variant='body2'
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <FontAwesomeIcon icon={faPerson} className='me-2' />{' '}
                {JuezData?.ApelName}
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: 'primary.light',
                p: 2,
                pt: 1,
                borderRadius: 2,
                textAlign: 'left'
              }}
            >
              <Typography
                variant='body2'
                mt={1}
                color='primary.contrastText'
                fontWeight={'bold'}
              >
                Esta votacion esta controlada por un moderador, la pantalla se
                actualizara automaticamente indicando el modelo que se este
                evaluando y las metricas que se van a evaluar.
              </Typography>
              <Typography
                variant='body2'
                color='primary.contrastText'
                fontWeight={'bold'}
                mt={1}
              >
                El tiempo de votación es limitado, por favor asegúrese de
                completar su evaluación antes de que se cierre la votación.
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Button
              variant='primary'
              className='w-100 fw-bold'
              onClick={() => {
                console.log('welcome')
              }}
            >
              Espere a que el moderador inicie la votacion{' '}
              <FontAwesomeIcon icon={faHourglassStart} className='ms-2' />
            </Button>
          </CardActions>
        </Card>
      </Box>
    )
  }

  if (currentScreen === 'evaluation') {
    return (
      <Box className='min-vh-100 bg-light p-3'>
        <Box sx={{ maxWidth: 400, mx: 'auto' }}>
          <Card sx={{ mb: 2 }}>
            <CardHeader
              sx={{ mb: 0, pb: 0 }}
              title={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Chip
                    label={EventoData?.Evento}
                    color='secondary'
                    size='small'
                  />
                  <Typography variant='caption'>
                    {Object.keys(votes).length}/{MetricaData.length}
                  </Typography>
                </Box>
              }
              subheader={
                <Typography className='mt-2' variant='h6'>
                  {ParticipanteActivo?.ApelName} -{' '}
                  {calcularEdad(ParticipanteActivo?.FechaNacimiento)} años
                </Typography>
              }
            />
            <CardContent className='mt-0 pt-3'>
              <LinearProgress
                variant='determinate'
                value={(Object.keys(votes).length / MetricaData.length) * 100}
                sx={{ mb: 2 }}
              />
              <Typography variant='body2'>
                {ParticipanteActivo?.Promotor ?? ''}
              </Typography>
            </CardContent>
          </Card>

          {MetricaData.map(metric => (
            <Card key={metric.IdMetrica} sx={{ mb: 2 }}>
              <CardHeader
                sx={{ mb: 0, pb: 0 }}
                title={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 0,
                      paddingBottom: 0
                    }}
                  >
                    <Typography variant='subtitle1'>
                      {metric.Metrica}
                    </Typography>
                    {votes[metric.id] && (
                      <Badge bg='success'>{votes[metric.IdMetrica]}/10</Badge>
                    )}
                  </Box>
                }
              />
              <CardContent>
                <Grid container spacing={1}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                    <Grid item xs={2.4} key={score}>
                      <Button
                        variant={
                          votes[metric.IdMetrica] === score
                            ? 'primary'
                            : 'outline-secondary'
                        }
                        size='sm'
                        className='w-100'
                        onClick={() => handleVote(metric.IdMetrica, score)}
                      >
                        {score}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          ))}

          <Button
            variant='primary'
            className='w-100 mb-2'
            onClick={handleSubmit}
            disabled={!isAllVoted}
          >
            <FontAwesomeIcon icon={faShare} /> Enviar Evaluación
          </Button>

          {!isAllVoted && (
            <Typography variant='caption' color='text.secondary' align='center'>
              Completa todas las métricas para enviar tu evaluación
            </Typography>
          )}
        </Box>
      </Box>
    )
  }

  if (currentScreen === 'success') {
    return (
      <Box className='min-vh-100 d-flex align-items-center justify-content-center bg-success bg-opacity-10 p-3'>
        <Card sx={{ width: '100%', maxWidth: 400, textAlign: 'center', p: 2 }}>
          <CardHeader
            avatar={
              <FontAwesomeIcon
                className='text-success'
                icon={faCircleCheck}
                style={{ width: '48px', height: '48px' }}
              />
            }
            title={
              <Typography variant='h6' fontWeight={'bold'}>
                ¡Evaluación Enviada!
              </Typography>
            }
            subheader='Gracias por tu participación'
          />
          <CardContent>
            <Box sx={{ bgcolor: 'success.light', p: 2, borderRadius: 2 }}>
              <Typography
                variant='body2'
                color='success.dark'
                fontWeight={'bold'}
                align='center'
              >
                Tu evaluación ha sido registrada exitosamente.
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'left', mt: 2 }}>
              <Typography variant='subtitle2'>
                Resumen de tu evaluación:
              </Typography>
              {MetricaData?.map(metric => (
                <Box
                  key={metric.id}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant='body2'>{metric.Metrica}:</Typography>
                  <Typography variant='body2' fontWeight='bold'>
                    {votes[metric.IdMetrica]}/10
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
          <CardActions>
            <Button
              variant='outline-secondary'
              className='w-100'
              onClick={() => {
                console.log('welcome')
              }}
            >
              Espere a que el moderador inicie la votacion
              <FontAwesomeIcon icon={faHourglassStart} className='ms-2' />
            </Button>
          </CardActions>
        </Card>
      </Box>
    )
  }

  return null
}
