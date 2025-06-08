import { useEffect, useMemo, useState } from 'react'
import { Badge, Table } from 'react-bootstrap'
import Button from '../../components/Button/Button'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import SectionPage from '../../components/SectionPage/SectionPage'
import { useEvento } from '../../context/SidebarContext/EventoContext'
import { listarJuezApi } from '../../services/JuecesService'
import { buscarParticipanteApi } from '../../services/ParticipantesService'
import {
  DetenerVotacionModeloApi,
  InicioVotacionModeloApi,
  listarVotacionApi,
  reiniciarVotacionApi
} from '../../services/VotacionService'
import { Alerta } from '../../functions/alerts'
import { MENSAJE_DEFAULT } from '../../Fixes/messages'
import { echo } from '../../config/EchoConfig'

function VotacionPage () {
  const { evento } = useEvento() // Usa el contexto

  const [JuecesData, setJuecesData] = useState([])
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
    reiniciarVotacionApi(id,evento?.IdEvento)
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

  return (
    <>
      <div>
        <HeaderPageComponent
          title='Metricas'
          items={[{ name: 'metricas', link: '/metricas' }]}
        />
        <SectionPage header={'Tabla de Votacion'}>
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
                <th>Acciones</th>
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
                              <Badge bg={getScoreVariant(m.score, m.maxScore)}>
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
                  <td>
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
      </div>
    </>
  )
}

export default VotacionPage
