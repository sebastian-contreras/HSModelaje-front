import { useMemo, useState } from 'react'
import { ButtonGroup, Dropdown, Form } from 'react-bootstrap'
import Button from '../../components/Button/Button'
import GenerateForms from '../../components/GenerateForms/GenerateForms'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import ModalModificado from '../../components/Modal/ModalModificado'
import SectionPage from '../../components/SectionPage/SectionPage'
import TablaMaterial from '../../components/TablaMaterial/TablaMaterial'
import { useEvento } from '../../context/SidebarContext/EventoContext'
import { API_URL } from '../../Fixes/API_URL'
import { doubleConfirmationAlert } from '../../functions/alerts'
import { useFetch } from '../../hooks/useFetch'
import {
  abonarEntradaApi,
  deleteEntradaApi,
  rechazarEntradaApi,
  storeEntradaApi,
  updateEntradaApi,
  usarEntradaApi
} from '../../services/EntradasService'
import GenerateInputs from '../../components/GenerateInputs/GenerateInputs'
import { useForm } from 'react-hook-form'
import { EstadosEntradasOptions, getLabelByValue } from '../../Fixes/fixes'
import { formatearFechayHora } from '../../Fixes/formatter'

function EntradasPage () {
  const { evento } = useEvento() // Usa el contexto
  const [Modal, setModal] = useState(false)
  const { control, errors, reset, handleSubmit } = useForm()
  const [Seleccionado, setSeleccionado] = useState(null)
  const [Busqueda, setBusqueda] = useState('')
  const [LoadingFinal, setLoadingFinal] = useState(false)

  const {
    data: dataZona,
    loading: loadingZona,
    error: errorZona
  } = useFetch(`${API_URL}/api/zonas/busqueda`, 'get', {
    pIdEvento: evento?.IdEvento,
    pCantidad: 9999,
    pPagina: 1
  })
  console.log(dataZona)

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
  } = useFetch(`${API_URL}/api/entradas/busqueda`, 'get', {
    pIdEvento: evento?.IdEvento,
    pCantidad: 10,
    pPagina: 1
  })
  function closeForm () {
    setSeleccionado(null)
    setModal(false)
  }

  const inputsFiltros = [
    {
      name: `pCadena`,
      control: control,
      label: 'Correo, Apellido, Nombre',
      type: 'text',
      error: errors?.pCadena,
      readOnly: false
    },
    {
      name: `pDNI`,
      control: control,
      label: 'DNI',
      type: 'text',
      error: errors?.pDNI,
      readOnly: false
    },
    {
      name: `pIdZona`,
      control: control,
      label: 'Zona',
      type: 'select',
      error: errors?.pIdZona,
      options: dataZona?.data?.map(zona => ({
        value: zona.IdZona,
        label: zona.Zona
      })),
      readOnly: false
    },
    {
      name: `pEstado`,
      control: control,
      label: 'Estado',
      type: 'select',
      error: errors?.pEstado,
      options: EstadosEntradasOptions,
      readOnly: false
    }
  ]
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
      { accessorKey: 'IdEntrada', header: '#' },
      {
        accessorKey: 'IdZona',
        header: 'Zona',
        Cell: ({ row }) =>
          dataZona?.data?.find(item => item?.IdZona == row?.original?.IdZona)?.Zona 
      },
      { accessorKey: 'Cantidad', header: 'Cantidad' },
      { accessorKey: 'ApelName', header: 'Apellido, Nombre' },
      { accessorKey: 'DNI', header: 'DNI' },
      { accessorKey: 'Correo', header: 'Correo' },
      { accessorKey: 'Telefono', header: 'Telefono' },
      { accessorKey: 'FechaAlta', header: 'Fecha Alta',
        Cell: ({ cell }) => formatearFechayHora(cell.getValue())
       },
      { accessorKey: 'EstadoEnt', header: 'Estado',
        Cell: ({ cell }) => getLabelByValue(EstadosEntradasOptions, cell.getValue())
       },
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
                  titulo: `Entrada ${row.original.IdEntrada}`
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
                  titulo: `Modificar a Entrada ${row.original.IdEntrada}`
                })
              }
            >
              Modificar
            </Button>

            <Button
              estilo='danger'
              onClick={() => {
                doubleConfirmationAlert({
                  textoConfirmacion: `¿Estas seguro de eliminar la entrada ${row.original.IdEntrada}?`,
                  textoSuccess: 'Se elimino la entrada correctamente',
                  textoError: 'No se elimino la entrada.',
                  funcion: () => deleteEntradaApi(row.original.IdEntrada),
                  refresh: refresh
                })
              }}
            >
              Borrar
            </Button>

            {row.original.EstadoEnt == 'P' ? (
              <Button
                estilo='success'
                onClick={() => {
                  doubleConfirmationAlert({
                    textoConfirmacion: `¿Estas seguro de abonar la entrada ${row.original.IdEntrada}?`,
                    textoSuccess: 'Se abono la entrada correctamente',
                    textoError: 'No se pudo abonar la entrada.',
                    funcion: () => abonarEntradaApi(row.original.IdEntrada),
                    refresh: refresh
                  })
                }}
                disabled={
                  row.original.EstadoEnt == 'R' || row.original.EstadoEnt == 'U'
                }
              >
                Abonar
              </Button>
            ) : (
              ''
            )}
            {row.original.EstadoEnt == 'P' ? (
              <Button
                estilo='warning'
                onClick={() => {
                  doubleConfirmationAlert({
                    textoConfirmacion: `¿Estas seguro de rechazar la entrada ${row.original.IdEntrada}?`,
                    textoSuccess: 'Se abono la entrada correctamente',
                    textoError: 'No se pudo rechazar la entrada.',
                    funcion: () => rechazarEntradaApi(row.original.IdEntrada),
                    refresh: refresh
                  })
                }}
                disabled={
                  row.original.EstadoEnt == 'R' || row.original.EstadoEnt == 'U'
                }
              >
                Rechazar
              </Button>
            ) : (
              ''
            )}

            {row.original.EstadoEnt == 'A' ? (
              <Button
                estilo='warning'
                onClick={() => {
                  doubleConfirmationAlert({
                    textoConfirmacion: `¿Estas seguro de usar la entrada ${row.original.IdEntrada}?`,
                    textoSuccess: 'Se abono la entrada correctamente',
                    textoError: 'No se pudo usar la entrada.',
                    funcion: () => usarEntradaApi(row.original.IdEntrada),
                    refresh: refresh
                  })
                }}
                disabled={
                  row.original.EstadoEnt == 'R' || row.original.EstadoEnt == 'U'
                }
              >
                Usar
              </Button>
            ) : (
              ''
            )}
            <Button
              estilo='primary'
              onClick={() => {
                window.open(
                  `${API_URL}/storage/${row.original.Comprobante}`,
                  '_blank'
                )
              }}
              disabled={!row.original.Comprobante}
            >
              Comprobante
            </Button>
          </ButtonGroup>
        )
      }
    ],
    [refresh]
  )

  function fastSearch (e) {
    setBusqueda(e.target.value)
    handleFilterParams({
      pCadena: e.target.value,
      pIdEvento: evento?.IdEvento
    })
  }

  const inputsFormulario = [
    {
      name: 'IdZona',
      label: 'Zona',
      type: 'select',
      estilos: 'col-12',
      options: dataZona?.data?.map(zona => ({
        value: zona.IdZona,
        label: zona.Zona
      }))
    },
    {
      name: 'Cantidad',
      label: 'Cantidad',
      type: 'number',
      min: 1,
      estilos: 'col-12',
      options: []
    },
    {
      name: 'ApelName',
      label: 'Apellido, Nombre',
      type: 'text',
      estilos: 'col-12',
      options: []
    },
    {
      name: 'DNI',
      label: 'DNI',
      type: 'text',
      estilos: 'col-12',
      options: []
    },
    {
      name: 'Telefono',
      label: 'Telefono',
      type: 'text',
      estilos: 'col-12',
      options: []
    },
    {
      name: 'Correo',
      label: 'Correo',
      type: 'email',
      estilos: 'col-12',
      options: []
    },
    {
      name: 'Archivo',
      label: 'Archivo',
      type: 'file',
      estilos: 'col-12',
      options: []
    }
  ]
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
  return (
    <>
      <div>
        <HeaderPageComponent
          title='Entradas'
          items={[{ name: 'entradas', link: '/entradas' }]}
        />
        <SectionPage header={'Listado de entradas registradas'}>
          <div className='d-flex justify-content-start'>
            <Button
              lg
              onClick={() =>
                openForm(null, {
                  soloVer: false,
                  modificar: false,
                  titulo: 'Registrar entrada'
                })
              }
            >
              Registrar entradas
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
              placeholder='Busqueda de entradas'
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
          id={'IdEntrada'}
          functionCreate={data =>
            storeEntradaApi({ IdEvento: evento?.IdEvento, ...data })
          }
          functionUpdate={updateEntradaApi}
          elemento={'Entrada'}
        />
      </ModalModificado>
    </>
  )
}

export default EntradasPage
