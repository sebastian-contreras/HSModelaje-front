import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import SectionPage from '../../components/SectionPage/SectionPage'
import { API_URL } from '../../Fixes/API_URL'
import { useFetch } from '../../hooks/useFetch'
import { InicioVotacionModeloApi } from '../../services/VotacionService'
import { listarMetricaApi } from '../../services/MetricasService'
import { useEvento } from '../../context/SidebarContext/EventoContext'
import { buscarParticipanteApi } from '../../services/ParticipantesService'
import { Badge, Table } from 'react-bootstrap'
import { listarJuezApi } from '../../services/JuecesService'

function VotacionPage () {
  const { evento } = useEvento() // Usa el contexto

  const [MetricaData, setMetricaData] = useState([])
  const [JuecesData, setJuecesData] = useState([])
  const [ParticipantesData, setParticipantesData] = useState([])
  const data = {
    votaciones: [
      {
        participante_id: 1,
        participante_nombre: 'Juan Pérez',
        metricas: [
          {
            metrica_id: 1,
            metrica_nombre: 'Originalidad',
            puntajes: [
              {
                juez_id: 1,
                juez_nombre: 'Juez A',
                puntuacion: 8
              },
              {
                juez_id: 2,
                juez_nombre: 'Juez B',
                puntuacion: 7
              }
            ],
            promedio: 7.5
          },
          {
            metrica_id: 2,
            metrica_nombre: 'Creatividad',
            puntajes: [
              {
                juez_id: 1,
                juez_nombre: 'Juez A',
                puntuacion: 9
              },
              {
                juez_id: 2,
                juez_nombre: 'Juez B',
                puntuacion: 8
              }
            ],
            promedio: 8.5
          }
        ],
        puntaje_total: 8
      },
      {
        participante_id: 2,
        participante_nombre: 'María Gómez',
        metricas: [
          {
            metrica_id: 1,
            metrica_nombre: 'Originalidad',
            puntajes: [
              {
                juez_id: 1,
                juez_nombre: 'Juez A',
                puntuacion: 10
              }
            ],
            promedio: 10
          }
        ],
        puntaje_total: 10
      }
    ]
  }

  const handleIniciar = async id => {
    console.log('Iniciar votación para participante', id)
    await InicioVotacionModeloApi(id)
    // Lógica para iniciar votación
  }

  const handleDetener = id => {
    console.log('Detener votación para participante', id)
    // Lógica para detener votación
  }

  const handleReiniciar = id => {
    console.log('Reiniciar votación para participante', id)
    // Lógica para reiniciar votación
  }

  useEffect(() => {
    listarMetricaApi(evento?.IdEvento).then(res => {
      console.log(res.data)
      setMetricaData(res.data)
    })
    listarJuezApi(10).then(res => {
      console.log(res.data)
      setJuecesData(res.data)
    })
    buscarParticipanteApi({
      pIdEvento: evento?.IdEvento,
      pCantidad: 1000,
      pPagina: 1
    }).then(res => {
      console.log(res.data)
      setParticipantesData(res.data.data)
    })
  }, [evento?.IdEvento])

  const judges = [
    { id: 'j1', name: 'Dr. Ana García', expertise: 'Machine Learning' },
    { id: 'j2', name: 'Prof. Carlos López', expertise: 'Computer Vision' },
    { id: 'j3', name: 'Dra. María Rodríguez', expertise: 'NLP' },
    { id: 'j4', name: 'Dr. Juan Martínez', expertise: 'AI Ethics' }
  ]

  const models = [
    {
      id: 'm1',
      name: 'GPT-4 Turbo',
      description: 'Modelo de lenguaje avanzado para tareas generales',
      averageScore: 8.5,
      votes: [
        {
          judgeId: 'j1',
          metrics: [
            { name: 'Precisión', score: 9, maxScore: 10 },
            { name: 'Velocidad', score: 8, maxScore: 10 },
            { name: 'Creatividad', score: 9, maxScore: 10 }
          ]
        },
        {
          judgeId: 'j2',
          metrics: [
            { name: 'Precisión', score: 8, maxScore: 10 },
            { name: 'Velocidad', score: 7, maxScore: 10 },
            { name: 'Creatividad', score: 8, maxScore: 10 }
          ]
        },
        {
          judgeId: 'j3',
          metrics: [
            { name: 'Precisión', score: 9, maxScore: 10 },
            { name: 'Velocidad', score: 8, maxScore: 10 },
            { name: 'Creatividad', score: 9, maxScore: 10 }
          ]
        },
        {
          judgeId: 'j4',
          metrics: [
            { name: 'Precisión', score: 8, maxScore: 10 },
            { name: 'Velocidad', score: 9, maxScore: 10 },
            { name: 'Creatividad', score: 7, maxScore: 10 }
          ]
        }
      ]
    }
    // ...otros modelos (omitidos por brevedad)
  ]

  function getScoreVariant (score, maxScore) {
    const percent = (score / maxScore) * 100
    if (percent >= 80) return 'success'
    if (percent >= 60) return 'warning'
    return 'danger'
  }

  const [selectedModel, setSelectedModel] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleViewDetails = model => {
    setSelectedModel(model)
    setShowModal(true)
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
              {models.map(model => (
                <tr key={model.id}>
                  <td>
                    <strong>{model.name}</strong>
                  </td>
                  <td className='text-center'>
                    <Badge bg={getScoreVariant(model.averageScore, 10)}>
                      {model.averageScore.toFixed(1)}
                    </Badge>
                  </td>
                  {JuecesData.map(judge => {
                    const vote = model.votes.find(v => v.judgeId === judge.IdJuez)
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
                      <Button sm onClick={() => handleIniciar()}>
                        Iniciar
                      </Button>
                      <Button
                        sm
                        estilo='warning'
                        onClick={() => handleDetener()}
                      >
                        Detener
                      </Button>
                      <Button
                        estilo='danger'
                        sm
                        onClick={() => handleReiniciar()}
                      >
                        Reiniciar
                      </Button>
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
