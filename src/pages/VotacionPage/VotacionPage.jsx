import Button from '../../components/Button/Button'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import SectionPage from '../../components/SectionPage/SectionPage'

function VotacionPage () {
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

  const handleIniciar = id => {
    console.log('Iniciar votación para participante', id)
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

  return (
    <>
      <div>
        <HeaderPageComponent
          title='Metricas'
          items={[{ name: 'metricas', link: '/metricas' }]}
        />
        <SectionPage header={'Tabla de Votacion'}>
          <div className='table-responsive'>
            <table className='table table-striped table-bordered'>
              <thead className='table-dark'>
                <tr>
                  <th>Participante</th>
                  <th>Métrica</th>
                  <th>Puntajes por Juez</th>
                  <th>Promedio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.votaciones.map(participante =>
                  participante.metricas
                    .map((metrica, metricaIndex) => (
                      <tr
                        key={`${participante.participante_id}-${metrica.metrica_id}`}
                      >
                        {/* Mostrar el nombre del participante solo una vez con rowspan */}
                        {metricaIndex === 0 && (
                          <td rowSpan={participante.metricas.length + 1}>
                            <strong>{participante.participante_nombre}</strong>
                          </td>
                        )}

                        <td>{metrica.metrica_nombre}</td>

                        <td>
                          {metrica.puntajes.map(puntaje => (
                            <div key={puntaje.juez_id}>
                              <strong>{puntaje.juez_nombre}</strong>:{' '}
                              {puntaje.puntuacion}
                            </div>
                          ))}
                        </td>

                        <td>{metrica.promedio}</td>

                        {/* Mostrar los botones solo en la primera fila de las métricas */}
                        {metricaIndex === 0 && (
                          <td rowSpan={participante.metricas.length + 1}>
                            <div className='d-grid gap-2'>
                              <Button
                                sm
                                onClick={() =>
                                  handleIniciar(participante.participante_id)
                                }
                              >
                                Iniciar
                              </Button>
                              <Button
                                sm
                                estilo='warning'
                                onClick={() =>
                                  handleDetener(participante.participante_id)
                                }
                              >
                                Detener
                              </Button>
                              <Button
                                estilo='danger'
                                sm
                                onClick={() =>
                                  handleReiniciar(participante.participante_id)
                                }
                              >
                                Reiniciar
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                    .concat(
                      // Fila de total
                      <tr
                        key={`total-${participante.participante_id}`}
                        className='table-secondary'
                      >
                        <td colSpan={2} className='text-end fw-bold'>
                          Total
                        </td>
                        <td className='fw-bold'>
                          {participante.puntaje_total}
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </SectionPage>
      </div>
    </>
  )
}

export default VotacionPage
