import { useEffect, useMemo, useState } from 'react'
import { ButtonGroup, Dropdown, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import Button from '../../components/Button/Button'
import GenerateForms from '../../components/GenerateForms/GenerateForms'
import GenerateInputs from '../../components/GenerateInputs/GenerateInputs'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import ModalModificado from '../../components/Modal/ModalModificado'
import SectionPage from '../../components/SectionPage/SectionPage'
import TablaMaterial from '../../components/TablaMaterial/TablaMaterial'
import { API_URL } from '../../Fixes/API_URL'
import { EstadosZonasOptions, SiONoOptions } from '../../Fixes/fixes'
import { doubleConfirmationAlert } from '../../functions/alerts'
import { useFetch } from '../../hooks/useFetch'
import {
  activarZonaApi,
  darBajaZonaApi,
  deleteZonaApi,
  storeZonaApi,
  updateZonaApi
} from '../../services/ZonasService'
import { useEvento } from '../../context/SidebarContext/EventoContext'
import { dameEstablecimientoApi } from '../../services/EstablecimientosService'

function ZonasPage () {
  const { evento } = useEvento() // Usa el contexto
  const { control, errors, reset, handleSubmit } = useForm()
  const [Establecimiento, setEstablecimiento] = useState({})

  useEffect(() => {
    if (evento) {
      dameEstablecimientoApi(evento.IdEvento).then(res => {
        console.log(res)
        setEstablecimiento(res.data[0])
      })
    }
  }, [evento])

  const inputsFiltros = [
    {
      name: `pZona`,
      control: control,
      label: 'Zona',
      type: 'text',
      error: errors?.pZona,
      readOnly: false
    },
    {
      name: `pAccesoDisc`,
      control: control,
      label: 'Espacio Inclusivo?',
      type: 'select',
      error: errors?.pAccesoDisc,
      options: SiONoOptions,
      readOnly: false
    },
    {
      name: `pEstado`,
      control: control,
      label: 'Estado',
      type: 'select',
      error: errors?.pEstado,
      options: EstadosZonasOptions,
      readOnly: false
    }
  ]

  const [Modal, setModal] = useState(false)
  const [Seleccionado, setSeleccionado] = useState(null)
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
  } = useFetch(`${API_URL}/api/zonas/busqueda`, 'get', {
    pIdEvento: evento?.IdEvento,
    pCantidad: 10,
    pPagina: 1
  })
  function closeForm () {
    setSeleccionado(null)
    setModal(false)
  }

  function openForm (
    e = null,
    { soloVer = false, modificar = false, titulo = 'No hay titulo' }
  ) {
    console.log(e?.original)
    setSeleccionado(e?.original)
    setModal({ soloVer, modificar, titulo })
  }

  const columns = useMemo(
    () => [
      { accessorKey: 'IdZona', header: '#' },
      { accessorKey: 'Zona', header: 'Zona' },
      { accessorKey: 'Capacidad', header: 'Capacidad' },
      { accessorKey: 'Ocupacion', header: 'Ocupacion' },
      { accessorKey: 'AccesoDisc', header: 'AccesoDisc' },
      { accessorKey: 'Precio', header: 'Precio' },
      { accessorKey: 'Detalle', header: 'Detalle' },
      { accessorKey: 'EstadoZona', header: 'Estado' },
      {
        accessorKey: 'acciones',
        header: 'Acciones',
        enableSorting: false,
        enableHiding: false,
        enableGlobalFilter: false,
        Cell: ({ row, table }) => (
          <ButtonGroup
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button
              estilo='primary'
              onClick={() =>
                openForm(row, {
                  soloVer: true,
                  titulo: `Zona ${row.original.Zona}`
                })
              }
            >
              Ver
            </Button>

            <Button
              estilo='secondary'
              onClick={() =>
                openForm(row, {
                  modificar: true,
                  titulo: `Modificar a ${row.original.Zona}`
                })
              }
            >
              Modificar
            </Button>

            <Button
              estilo='danger'
              onClick={() => {
                doubleConfirmationAlert({
                  textoConfirmacion: `¿Estas seguro de eliminar la zona ${row.original.Zona}?`,
                  textoSuccess: 'Se elimino la zona correctamente',
                  textoError: 'No se elimino la zona.',
                  funcion: () => deleteZonaApi(row.original.IdZona),
                  refresh: refresh
                })
              }}
            >
              Borrar
            </Button>
            {row.original.EstadoZona == 'A' ? (
              <Button
                estilo='warning'
                onClick={() => {
                  doubleConfirmationAlert({
                    textoConfirmacion: `¿Estas seguro de dar de baja la zona ${row.original.Zona}?`,
                    textoSuccess: 'Se dio de baja la zona correctamente',
                    textoError: 'No se dio de baja la zona.',
                    funcion: () => darBajaZonaApi(row.original.IdZona),
                    refresh: refresh
                  })
                }}
                disabled={row.original.EstadoZona == 'B'}
              >
                Dar Baja
              </Button>
            ) : (
              ''
            )}
            {row.original.EstadoZona == 'B' ? (
              <Button
                estilo='success'
                onClick={() => {
                  doubleConfirmationAlert({
                    textoConfirmacion: `¿Estas seguro de activar la zona ${row.original.Zona}?`,
                    textoSuccess: 'Se activo la zona correctamente',
                    textoError: 'No se activo la zona.',
                    funcion: () => activarZonaApi(row.original.IdZona),
                    refresh: refresh
                  })
                }}
                disabled={row.original.EstadoZona == 'A'}
              >
                Activar
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
    handleFilterParams({
      ...data,
      pCantidad: 10,
      pPagina: 1,
      pIdEvento: evento.IdEvento
    })
    // Aquí puedes manejar los datos del formulario
  }

  function fastSearch (e) {
    setBusqueda(e.target.value)
    handleFilterParams({ pZona: e.target.value, pIdEvento: evento.IdEvento })
  }

  const inputsFormulario = [
    {
      name: 'Zona',
      label: 'Zona',
      type: 'text',
      estilos: 'col-12',
      options: []
    },
    {
      name: 'Capacidad',
      label: 'Capacidad',
      type: 'text',
      estilos: 'col-12',
      options: []
    },
    {
      name: 'AccesoDisc',
      label: '¿Espacio Inclusivo?',
      type: 'select',
      estilos: 'col-12',
      options: SiONoOptions
    },
    {
      name: 'Precio',
      label: 'Precio',
      type: 'number',
      estilos: 'col-12',
      options: []
    },
    {
      name: 'Detalle',
      label: 'Detalle',
      type: 'text',
      estilos: 'col-12',
      options: []
    }
  ]

  return (
    <>
      <div>
        <HeaderPageComponent
          title='Zonas'
          items={[{ name: 'zonas', link: '/zonas' }]}
        />
        <SectionPage header={'Listado de zonas registradas'}>
          <div className='d-flex justify-content-start'>
            <Button
              lg
              onClick={() =>
                openForm(null, {
                  soloVer: false,
                  modificar: false,
                  titulo: 'Registrar zona'
                })
              }
            >
              Registrar zonas
            </Button>
          </div>
          <div className='alert alert-info mt-4' role='alert'>
            Evento realizado en <b>{Establecimiento.Establecimiento}</b>, este lugar
            tiene una capacidad promedio de <b>{Establecimiento.Capacidad}</b>, Ten en
            cuenta esto a la hora de crear las zonas. <b>Esto va a definir la cantidad de entradas a crear.</b>
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
                    inputs={inputsFiltros}
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
              className='form-control'
              onChange={fastSearch}
              placeholder='Busqueda de zona'
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
        size={30}
        title={Modal.titulo}
      >
        <GenerateForms
          closeModal={closeForm}
          onlyView={Modal.soloVer}
          modificar={Modal.modificar}
          dataform={Seleccionado}
          refresh={refresh}
          inputs={inputsFormulario}
          id={'IdZona'}
          functionCreate={e =>
            storeZonaApi({ IdEvento: evento.IdEvento, ...e })
          }
          functionUpdate={updateZonaApi}
          elemento={'Zona'}
        />
      </ModalModificado>
    </>
  )
}

export default ZonasPage
