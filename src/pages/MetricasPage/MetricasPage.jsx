import { useMemo, useState } from 'react'
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
import {
  EstadosMetricasOptions,
} from '../../Fixes/fixes'
import { doubleConfirmationAlert } from '../../functions/alerts'
import { useFetch } from '../../hooks/useFetch'
import {
  activarMetricaApi,
  darBajaMetricaApi,
  deleteMetricaApi,
  storeMetricaApi,
  updateMetricaApi
} from '../../services/MetricasService'
import { useEvento } from '../../context/SidebarContext/EventoContext'

function MetricasPage () {
  const { evento } = useEvento() // Usa el contexto
  const { control, errors, reset, handleSubmit } = useForm()
  const inputsTest = [
    {
      name: `pMetrica`,
      control: control,
      label: 'Metrica',
      type: 'text',
      error: errors?.pMetrica,
      readOnly: false
    },
    {
      name: `pEstado`,
      control: control,
      label: 'Estado',
      type: 'select',
      error: errors?.pEstado,
      options: EstadosMetricasOptions,
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
  } = useFetch(`${API_URL}/api/metricas/busqueda`, 'get', {
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
      { accessorKey: 'IdMetrica', header: '#' },
      { accessorKey: 'Metrica', header: 'Metrica' },
      { accessorKey: 'EstadoMetrica', header: 'Estado' },
      {
        accessorKey: 'acciones',
        header: 'Acciones',
        enableSorting: false,
        size: '450',
        enableGlobalFilter: false,
        Cell: ({ row, table }) => (
          <ButtonGroup
            style={{ display: 'flex', justifyContent: 'flex-end' }}
            className='pe-5'
          >
            <Button
              estilo='primary'
              onClick={() =>
                openForm(row, {
                  soloVer: true,
                  titulo: `Metrica ${row.original.Metrica}`
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
                  titulo: `Modificar a ${row.original.Metrica}`
                })
              }
            >
              Modificar
            </Button>

            <Button
              estilo='danger'
              onClick={() => {
                doubleConfirmationAlert({
                  textoConfirmacion: `¿Estas seguro de eliminar la metrica ${row.original.Metrica}?`,
                  textoSuccess: 'Se elimino la metrica correctamente',
                  textoError: 'No se elimino la metrica.',
                  funcion: () => deleteMetricaApi(row.original.IdMetrica),
                  refresh: refresh
                })
              }}
            >
              Borrar
            </Button>
            {row.original.EstadoMetrica == 'A' ? (
              <Button
                estilo='warning'
                onClick={() => {
                  doubleConfirmationAlert({
                    textoConfirmacion: `¿Estas seguro de dar de baja la metrica ${row.original.Metrica}?`,
                    textoSuccess: 'Se dio de baja la metrica correctamente',
                    textoError: 'No se dio de baja la metrica.',
                    funcion: () => darBajaMetricaApi(row.original.IdMetrica),
                    refresh: refresh
                  })
                }}
                disabled={row.original.EstadoMetrica == 'B'}
              >
                Dar Baja
              </Button>
            ) : (
              ''
            )}
            {row.original.EstadoMetrica == 'B' ? (
              <Button
                estilo='success'
                onClick={() => {
                  doubleConfirmationAlert({
                    textoConfirmacion: `¿Estas seguro de activar la metrica ${row.original.Metrica}?`,
                    textoSuccess: 'Se activo la metrica correctamente',
                    textoError: 'No se activo la metrica.',
                    funcion: () => activarMetricaApi(row.original.IdMetrica),
                    refresh: refresh
                  })
                }}
                disabled={row.original.EstadoMetrica == 'A'}
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
    handleFilterParams({ ...data, pCantidad: 10, pPagina: 1, pIdEvento:evento.IdEvento })
    // Aquí puedes manejar los datos del formulario
  }

  function fastSearch (e) {
    setBusqueda(e.target.value)
    handleFilterParams({ pMetrica: e.target.value,pIdEvento:evento.IdEvento })
  }

  const inputsFormulario = [

    {
      name: 'Metrica',
      label: 'Metrica',
      type: 'text',
      estilos: 'col-12',
      options: []
    },
  ]

  return (
    <>
      <div>
        <HeaderPageComponent
          title='Metricas'
          items={[{ name: 'metricas', link: '/metricas' }]}
        />
        <SectionPage header={'Listado de metricas registradas'}>
          <div className='d-flex justify-content-start'>
            <Button
              lg
              onClick={() =>
                openForm(null, {
                  soloVer: false,
                  modificar: false,
                  titulo: 'Registrar metrica'
                })
              }
            >
              Registrar metricas
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
              className='form-control'
              onChange={fastSearch}
              placeholder='Busqueda de metrica'
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
          id={'IdMetrica'}
          functionCreate={e =>
            storeMetricaApi({ IdEvento: evento.IdEvento, ...e })
          }
          functionUpdate={updateMetricaApi}
          elemento={'Metrica'}
        />
      </ModalModificado>
    </>
  )
}

export default MetricasPage
