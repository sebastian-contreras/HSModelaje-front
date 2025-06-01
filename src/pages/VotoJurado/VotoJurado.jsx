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
import { useState } from 'react'
import { Badge, Button } from 'react-bootstrap'

export default function VotoJurado () {
  const [currentScreen, setCurrentScreen] = useState('welcome')
  const [votes, setVotes] = useState({})

  const modelData = {
    name: 'NOMBRE DEL MODELO',
    edad: '25',
    description: 'Promotor o lo que haya',
    category: 'Procesamiento de Lenguaje Natural',
    metrics: [
      {
        id: 'accuracy',
        name: 'Precisión',
        description: 'Exactitud en las respuestas generadas'
      },
      {
        id: 'coherence',
        name: 'Coherencia',
        description: 'Consistencia lógica en las respuestas'
      },
      {
        id: 'creativity',
        name: 'Creatividad',
        description: 'Capacidad de generar contenido original'
      }
    ]
  }

  const handleVote = (metricId, score) => {
    setVotes(prev => ({ ...prev, [metricId]: score }))
  }

  const handleSubmit = () => {
    console.log('Votos enviados:', votes)
    setCurrentScreen('success')
  }

  const isAllVoted = modelData.metrics.every(
    metric => votes[metric.id] !== undefined
  )

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
            title={<Typography variant='h6'>¡Bienvenido al Evento!</Typography>}
            subheader='Evaluación de Modelos'
          />
          <CardContent>
            <Box sx={{ textAlign: 'left', mb: 2 }}>
              <Typography
                variant='body2'
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <FontAwesomeIcon icon={faCalendar} className='me-2' /> 15 de
                Diciembre, 2024
              </Typography>
              <Typography
                variant='body2'
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <FontAwesomeIcon icon={faLocationDot} className='me-2' /> NOMBRE
                DE EL ESTABLECIMIENTO
              </Typography>
              <Typography
                variant='body2'
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <FontAwesomeIcon icon={faPerson} className='me-2' /> NOMBRE DEL
                JUEZ
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
              onClick={() => setCurrentScreen('evaluation')}
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
                    label={'Nombre evento'}
                    color='secondary'
                    size='small'
                  />
                  <Typography variant='caption'>
                    {Object.keys(votes).length}/{modelData.metrics.length}
                  </Typography>
                </Box>
              }
              subheader={
                <Typography variant='h6'>
                  {modelData.name} - {modelData?.edad} años
                </Typography>
              }
            />
            <CardContent>
              <LinearProgress
                variant='determinate'
                value={
                  (Object.keys(votes).length / modelData.metrics.length) * 100
                }
                sx={{ mb: 2 }}
              />
              <Typography variant='body2'>{modelData.description}</Typography>
            </CardContent>
          </Card>

          {modelData.metrics.map(metric => (
            <Card key={metric.id} sx={{ mb: 2 }}>
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
                    <Typography variant='subtitle1'>{metric.name}</Typography>
                    {votes[metric.id] && (
                      <Badge bg='success'>{votes[metric.id]}/10</Badge>
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
                          votes[metric.id] === score
                            ? 'primary'
                            : 'outline-secondary'
                        }
                        size='sm'
                        className='w-100'
                        onClick={() => handleVote(metric.id, score)}
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
              {modelData.metrics.map(metric => (
                <Box
                  key={metric.id}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant='body2'>{metric.name}:</Typography>
                  <Typography variant='body2' fontWeight='bold'>
                    {votes[metric.id]}/10
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
                setCurrentScreen('welcome')
                setVotes({})
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
