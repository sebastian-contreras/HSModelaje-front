import { useMemo, useState } from 'react'
import { ButtonGroup, Dropdown, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import Button from '../../components/Button/Button'
import GenerateInputs from '../../components/GenerateInputs/GenerateInputs'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import SectionPage from '../../components/SectionPage/SectionPage'
import TablaMaterial from '../../components/TablaMaterial/TablaMaterial'
import { API_URL } from '../../Fixes/API_URL'
import {
  EstadosEventosOptions,
  getLabelByValue,
  VotacionOptions
} from '../../Fixes/fixes'
import { doubleConfirmationAlert } from '../../functions/alerts'
import { useFetch } from '../../hooks/useFetch'
import {
  activarEventoApi,
  darBajaEventoApi,
  deleteEventoApi,
  finalizarEventoApi
} from '../../services/EventosService'
import ModalModificado from '../../components/Modal/ModalModificado'
import FormEventos from '../../components/Formularios/FormEventos/FormEventos'
import FormFinalizarEvento from '../../components/Formularios/FormEventos/FormFinalizarEvento'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/Auth/AuthContext'
import { formatearFechayHora } from '../../Fixes/formatter'

function EventosPage () {
  const navigate = useNavigate()
  const { control, errors, reset, handleSubmit } = useForm()
  const inputsTest = [
    {
      name: `pCadena`,
      control: control,
      label: 'Evento',
      type: 'text',
      error: errors?.pCadena,
      readOnly: false
    },

    {
      name: `pFechaInicio`,
      control: control,
      label: 'Fecha Inicio',
      type: 'date',
      error: errors?.pFechaInicio,
      readOnly: false
    },
    {
      name: `pFechaFinal`,
      control: control,
      label: 'Fecha Final',
      type: 'date',
      error: errors?.pFechaFinal,
      readOnly: false
    },
    {
      name: `pEstado`,
      control: control,
      label: 'Estado',
      type: 'select',
      error: errors?.pEstado,
      options: EstadosEventosOptions,
      readOnly: false
    }
  ]
  const { user } = useAuth()

  const [Modal, setModal] = useState(false)
  const [ModalFinalizar, setModalFinalizar] = useState(false)
  const [Seleccionado, setSeleccionado] = useState(null)
  const [pEstado, setpEstado] = useState('T')
  const [pIncluyeVotacion, setpIncluyeVotacion] = useState('S')
  const [Busqueda, setBusqueda] = useState('')
  const {
    data,
    loading,
    error,
    pagination,
    handleFilterParams,
    setPagination,
    columnFilters,
    refresh,
    setColumnFilters,
    sorting,
    setSorting
  } = useFetch(`${API_URL}/api/eventos/busqueda`, 'get', {
    pEstado: pEstado,
    pCantidad: 10,
    pPagina: 1
  })
  console.log(pagination)
  function closeForm () {
    setSeleccionado(null)
    setModal(false)
    setModalFinalizar(false)
  }

  function openForm (
    e = null,
    { soloVer = false, modificar = false, titulo = 'No hay titulo' }
  ) {
    console.log(e?.original)
    setSeleccionado(e?.original)
    setModal({ soloVer, modificar, titulo })
  }

  function openFormFinalizar (
    e = null,
    { soloVer = false, modificar = false, titulo = 'No hay titulo' }
  ) {
    console.log(e?.original)
    setSeleccionado(e?.original)
    setModalFinalizar({ soloVer, modificar, titulo })
  }

  const columns = useMemo(
    () => [
      { accessorKey: 'IdEvento', header: '#' },
      { accessorKey: 'Evento', header: 'Evento' },
      {
        accessorKey: 'FechaProbableInicio',
        header: 'FechaProbableInicio',
        Cell: ({ cell }) =>
          cell.getValue() ? formatearFechayHora(cell.getValue()) : '-'
      },
      {
        accessorKey: 'FechaProbableFinal',
        header: 'FechaProbableFinal',
        Cell: ({ cell }) =>
          cell.getValue() ? formatearFechayHora(cell.getValue()) : '-'
      },
      {
        accessorKey: 'FechaInicio',
        header: 'Fecha Inicio',
        Cell: ({ cell }) =>
          cell.getValue() ? formatearFechayHora(cell.getValue()) : '-'
      },
      {
        accessorKey: 'FechaFinal',
        header: 'Fecha Final',
        Cell: ({ cell }) =>
          cell.getValue() ? formatearFechayHora(cell.getValue()) : '-'
      },
      { accessorKey: 'IdEstablecimiento', header: 'Establecimiento' },
      {
        accessorKey: 'Votacion',
        header: '¿Votacion?',
        Cell: ({ cell }) => getLabelByValue(VotacionOptions, cell.getValue())
      },
      {
        accessorKey: 'EstadoEvento',
        header: 'Estado',
        Cell: ({ cell }) =>
          getLabelByValue(EstadosEventosOptions, cell.getValue())
      },
      {
        accessorKey: 'acciones',
        header: 'Acciones',
        enableSorting: false,
        enableHiding: false,
        enableGlobalFilter: false,
        Cell: ({ row, table }) => (
          <ButtonGroup style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              estilo='primary'
              onClick={() =>
                openForm(row, {
                  soloVer: true,
                  titulo: `Evento ${row.original.Evento}`
                })
              }
            >
              Ver
            </Button>
            <Button
              estilo='success'
              onClick={() =>
                user.role == 'A'
                  ? window.open('/eventos/' + row.original.IdEvento, '_blank')
                  : user.role == 'M'
                  ? window.open(
                      '/eventos/' + row.original.IdEvento + '/participantes',
                      '_blank'
                    )
                  : ''
              }
            >
              Ingresar
            </Button>
            {row.original.EstadoEvento != 'F' ? (
              <Button
                estilo='secondary'
                hidden={user.role != 'A'}
                onClick={() =>
                  openForm(row, {
                    modificar: true,
                    titulo: `Modificar a ${row.original.Evento}`
                  })
                }
              >
                Modificar
              </Button>
            ) : (
              ''
            )}

            <Button
              hidden={user.role != 'A'}
              estilo='danger'
              onClick={() => {
                doubleConfirmationAlert({
                  textoConfirmacion: `¿Estas seguro de eliminar el evento ${row.original.Evento}?`,
                  textoSuccess: 'Se elimino el evento correctamente',
                  textoError: 'No se elimino el evento.',
                  funcion: () => deleteEventoApi(row.original.IdEvento),
                  refresh: refresh
                })
              }}
            >
              Borrar
            </Button>
            {row.original.EstadoEvento == 'A' ? (
              <Button
                hidden={user.role != 'A'}
                estilo='warning'
                onClick={() => {
                  doubleConfirmationAlert({
                    textoConfirmacion: `¿Estas seguro de dar de baja el evento ${row.original.Evento}?`,
                    textoSuccess: 'Se dio de baja el evento correctamente',
                    textoError: 'No se dio de baja el evento.',
                    funcion: () => darBajaEventoApi(row.original.IdEvento),
                    refresh: refresh
                  })
                }}
                disabled={row.original.EstadoEvento == 'B'}
              >
                Dar Baja
              </Button>
            ) : (
              ''
            )}
            {row.original.EstadoEvento == 'B' ? (
              <Button
                hidden={user.role != 'A'}
                estilo='success'
                onClick={() => {
                  doubleConfirmationAlert({
                    textoConfirmacion: `¿Estas seguro de activar el evento ${row.original.Evento}?`,
                    textoSuccess: 'Se activo el evento correctamente',
                    textoError: 'No se activo el evento.',
                    funcion: () => activarEventoApi(row.original.IdEvento),
                    refresh: refresh
                  })
                }}
                disabled={row.original.EstadoEvento == 'A'}
              >
                Activar
              </Button>
            ) : (
              ''
            )}
            {row.original.EstadoEvento == 'A' ? (
              <Button
                hidden={user.role != 'A'}
                estilo='primary'
                onClick={() =>
                  openFormFinalizar(row, {
                    soloVer: false,
                    modificar: false,
                    titulo: 'Finalizar evento ' + row.original.Evento
                  })
                }
                disabled={row.original.EstadoEvento != 'A'}
              >
                Finalizar
              </Button>
            ) : (
              ''
            )}
          </ButtonGroup>
        )
      }
    ],
    [refresh]
  )

  const onSubmit = data => {
    console.log(data)
    handleFilterParams({ ...data, pCantidad: 10, pPagina: 1 })
    // Aquí puedes manejar los datos del formulario
  }

  function fastSearch (e) {
    setBusqueda(e.target.value)
    handleFilterParams({ pCadena: e.target.value })
  }

  return (
    <>
      <div>
        <HeaderPageComponent
          title='Eventos'
          items={[{ name: 'eventos', link: '/eventos' }]}
        />
        <SectionPage header={'Listado de eventos registradas'}>
          <div className='d-flex justify-content-start'>
            <Button
              lg
              onClick={() =>
                openForm(null, {
                  soloVer: false,
                  modificar: false,
                  titulo: 'Registrar evento'
                })
              }
            >
              Registrar eventos
            </Button>
          </div>

          <div className='input-group mb-0 mt-5'>
            <Dropdown className='me-3' style={{ width: '20rem' }}>
              <Dropdown.Toggle
                variant='primary'
                className='w-100'
                id='dropdown-basic'
              >
                Filtros Avanzado
              </Dropdown.Toggle>

              <Dropdown.Menu className='w-100'>
                <Form
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ padding: '10px' }}
                >
                  <GenerateInputs
                    inputs={inputsTest}
                    control={control}
                    errors={errors}
                    onlyView={false}
                  />
                  <Button estilo='primary' type='submit'>
                    Enviar Filtros
                  </Button>
                </Form>
              </Dropdown.Menu>
            </Dropdown>
            <span className='input-group-text'>
              <i className='fas fa-search'></i>
            </span>
            <input
              type='text'
              value={Busqueda}
              onChange={fastSearch}
              className='form-control'
              placeholder='Busqueda de eventos por nombre'
            />
          </div>

          {error ? (
            'Ocurrio un error, contacte con el administrador.'
          ) : (
            <TablaMaterial
              columnFilters={columnFilters}
              loading={loading}
              pagination={pagination}
              setColumnFilters={setColumnFilters}
              setPagination={setPagination}
              setSorting={setSorting}
              rowCount={data?.total_row}
              sorting={sorting}
              columns={columns}
              data={data.data}
            />
          )}
        </SectionPage>
      </div>
      <ModalModificado
        show={Modal}
        handleClose={closeForm}
        size={40}
        title={Modal.titulo}
      >
        <FormEventos
          closeModal={closeForm}
          onlyView={Modal.soloVer}
          modificar={Modal.modificar}
          dataform={Seleccionado}
          refresh={refresh}
        />
      </ModalModificado>
      <ModalModificado
        show={ModalFinalizar}
        handleClose={closeForm}
        size={40}
        title={ModalFinalizar.titulo}
      >
        <FormFinalizarEvento
          closeModal={closeForm}
          onlyView={ModalFinalizar.soloVer}
          modificar={ModalFinalizar.modificar}
          dataform={Seleccionado}
          refresh={refresh}
          IdEvento={Seleccionado?.IdEvento}
        />
      </ModalModificado>
    </>
  )
}

export default EventosPage
