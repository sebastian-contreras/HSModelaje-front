import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Badge, Table } from 'react-bootstrap'
import Button from '../../components/Button/Button'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import SectionPage from '../../components/SectionPage/SectionPage'
import { useEvento } from '../../context/SidebarContext/EventoContext'
import { listarJuezApi } from '../../services/JuecesService'
import { buscarParticipanteApi } from '../../services/ParticipantesService'
import {
  DetenerVotacionModeloApi,
  finalizarVotacionApi,
  iniciarVotacionApi,
  InicioVotacionModeloApi,
  listarVotacionApi,
  reiniciarVotacionApi
} from '../../services/VotacionService'
import { Alerta } from '../../functions/alerts'
import { MENSAJE_DEFAULT } from '../../Fixes/messages'
import { echo } from '../../config/EchoConfig'
import { downloadInformeVotacion } from '../../services/InformesService'

function VotacionPage () {
  const { evento, refresh } = useEvento() // Usa el contexto
  const [JuecesData, setJuecesData] = useState([])
  const [Loading, setLoading] = useState(false)
  const [ParticipantesData, setParticipantesData] = useState([])
  const [Votos, setVotos] = useState([])
  const votosByParticipante = useMemo(() => {
    const map = new Map()
    Votos.forEach(voto => {
      map.set(voto.IdParticipante, voto)
    })
    return map
  }, [Votos])
  const [ParticipanteActivo, setParticipanteActivo] = useState(null)

  const handleIniciar = async id => {
    InicioVotacionModeloApi(id)
      .then(res => {
        console.log('Iniciar votación para participante', id)

        setParticipanteActivo(id)
      })
      .catch(err => {
        Alerta()
          .withMini(true)
          .withTipo('error')
          .withTitulo('Error al iniciar votación')
          .withMensaje(
            err?.response?.data?.message
              ? err.response.data.message
              : MENSAJE_DEFAULT
          )
      })
  }

  const handleDetener = id => {
    DetenerVotacionModeloApi(id)
      .then(res => {
        setParticipanteActivo(null)
      })
      .catch(err => {
        Alerta()
          .withMini(true)
          .withTipo('error')
          .withTitulo('Error al detener votación')
          .withMensaje(
            err?.response?.data?.message
              ? err.response.data.message
              : MENSAJE_DEFAULT
          )
      })
  }

  const handleReiniciar = id => {
    reiniciarVotacionApi(id, evento?.IdEvento)
      .then(res => {
        setParticipanteActivo(null)
        Alerta()
          .withMini(true)
          .withTipo('success')
          .withTitulo('Votación reiniciada exitosamente')
          .build()
      })
      .catch(err => {
        Alerta()
          .withMini(true)
          .withTipo('error')
          .withTitulo('Error al reiniciar votación')
          .withMensaje(
            err?.response?.data?.message
              ? err.response.data.message
              : MENSAJE_DEFAULT
          )
      })
  }

  useEffect(() => {
    listarJuezApi(evento?.IdEvento).then(res => {
      setJuecesData(res.data)
    })
    listarVotacionApi(evento?.IdEvento).then(res => {
      setVotos(res.data)
    })
    buscarParticipanteApi({
      pIdEvento: evento?.IdEvento,
      pCantidad: 1000,
      pPagina: 1
    }).then(res => {
      setParticipantesData(res.data.data)
    })
    // Conectar al canal de votación
    const channel = echo.channel('evento-' + evento?.IdEvento)
    channel.listen('ListadoVotosParticipantes', data => {
      setVotos(data.votos)
    })

    return () => {
      echo.leaveChannel('evento-' + evento?.IdEvento)
    }
  }, [evento?.IdEvento])

  function getScoreVariant (score, maxScore) {
    const percent = (score / maxScore) * 100
    if (percent >= 80) return 'success'
    if (percent >= 50) return 'primary'
    if (percent >= 30) return 'warning'
    return 'danger'
  }

  const iniciarVotacion = async () => {
    iniciarVotacionApi(evento.IdEvento)
      .then(res => {
        refresh()
        Alerta()
          .withMini(true)
          .withTipo('success')
          .withTitulo('Votación iniciada exitosamente')
          .build()
      })
      .catch(err => {
        Alerta()
          .withMini(true)
          .withTipo('error')
          .withTitulo('Error al iniciar votación')
          .withMensaje(
            err?.response?.data?.message
              ? err.response.data.message
              : MENSAJE_DEFAULT
          )
      })
  }

  const finalizarVotacion = async () => {
    finalizarVotacionApi(evento.IdEvento)
      .then(res => {
        refresh()
        Alerta()
          .withMini(true)
          .withTipo('success')
          .withTitulo('Votación finalizada exitosamente')
          .build()
      })
      .catch(err => {
        Alerta()
          .withMini(true)
          .withTipo('error')
          .withTitulo('Error al finalzar votación')
          .withMensaje(
            err?.response?.data?.message
              ? err.response.data.message
              : MENSAJE_DEFAULT
          )
      })
  }

  const exportarHtmlTabla = async () => {
    setLoading(true)
    downloadInformeVotacion(evento.IdEvento)
      .then(res => {
        console.log(res)
        Alerta()
          .withTipo('success')
          .withTitulo('Informe descargado')
          .withMensaje('El informe se ha descargado correctamente')
          .withMini(true)
          .build()
      })
      .catch(() => {
        Alerta()
          .withTipo('error')
          .withTitulo('Error al descargar el informe')
          .withMensaje('No se pudo descargar el informe')
          .withMini(true)
          .build()
      })
      .finally(() => setLoading(false))
  }

  return (
    <>
      <div>
        <HeaderPageComponent
          title='Votacion'
          items={[{ name: 'votacion', link: '/votacion' }]}
        />
        {evento?.Votacion == 'N' ? (
          <Alert variant='warning'>
            <Alert.Heading>El evento no tiene votacion</Alert.Heading>
            <p>El evento fue configurado sin activar la votación</p>
          </Alert>
        ) : (
          <SectionPage header={'Tabla de Votacion'}>
            <div className='d-flex gap-3 mb-3'>
              {evento?.Votacion == 'S' && (
                <Button onClick={iniciarVotacion} estilo='primary' lg>
                  Iniciar Votacion
                </Button>
              )}
              {evento?.Votacion == 'P' && (
                <Button onClick={finalizarVotacion} estilo='secondary' lg>
                  Finalizar Votacion
                </Button>
              )}
              {evento?.Votacion == 'F' && (
                <Button  onClick={exportarHtmlTabla}  estilo='info' lg>
                  Exportar Votacion
                </Button>
              )}
            </div>
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Modelo</th>
                  <th>Promedio</th>
                  {JuecesData.map(j => (
                    <th key={j.IdJuez} className='text-center'>
                      <div className='fw-bold'>{j.ApelName}</div>
                    </th>
                  ))}

                  <th hidden={evento?.Votacion != 'P'}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ParticipantesData.map(model => (
                  <tr key={model?.IdParticipante}>
                    <td>
                      <strong>{model?.ApelName}</strong>
                    </td>
                    <td className='text-center'>
                      <Badge
                        bg={getScoreVariant(
                          votosByParticipante?.get(model?.IdParticipante)
                            ?.averageScore,
                          10
                        )}
                      >
                        {votosByParticipante
                          ?.get(model?.IdParticipante)
                          ?.averageScore?.toFixed(1)}
                      </Badge>
                    </td>
                    {JuecesData.map(judge => {
                      const vote = votosByParticipante
                        ?.get(model?.IdParticipante)
                        ?.votes?.find(v => v.IdJuez == judge.IdJuez)
                      return (
                        <td key={judge.IdJuez} className='text-center'>
                          {vote ? (
                            vote.metrics.map((m, idx) => (
                              <div
                                key={idx}
                                className='d-flex justify-content-between'
                              >
                                <small className='text-muted'>{m.name}</small>
                                <Badge
                                  bg={getScoreVariant(m.score, m.maxScore)}
                                >
                                  {m.score}
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <span className='text-muted'>Sin votar</span>
                          )}
                        </td>
                      )
                    })}
                    <td hidden={evento?.Votacion != 'P'}>
                      <div className='d-grid gap-2'>
                        {(!ParticipanteActivo ||
                          ParticipanteActivo == model.IdParticipante) && (
                          <>
                            {ParticipanteActivo != model.IdParticipante && (
                              <Button
                                sm
                                onClick={() =>
                                  handleIniciar(model.IdParticipante)
                                }
                              >
                                Iniciar
                              </Button>
                            )}
                            {ParticipanteActivo == model.IdParticipante && (
                              <Button
                                sm
                                estilo='warning'
                                onClick={() =>
                                  handleDetener(model.IdParticipante)
                                }
                              >
                                Detener
                              </Button>
                            )}
                            {ParticipanteActivo != model.IdParticipante && (
                              <Button
                                estilo='danger'
                                sm
                                onClick={() =>
                                  handleReiniciar(model.IdParticipante)
                                }
                              >
                                Reiniciar
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </SectionPage>
        )}
      </div>
    </>
  )
}

export default VotacionPage
