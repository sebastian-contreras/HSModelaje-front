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
  EstadosModelosOptions,
  getLabelByValue,
  SexoOptions,
} from '../../Fixes/fixes'
import { doubleConfirmationAlert } from '../../functions/alerts'
import { useFetch } from '../../hooks/useFetch'
import {
  activarModeloApi,
  darBajaModeloApi,
  deleteModeloApi,
  storeModeloApi,
  updateModeloApi
} from '../../services/ModelosService'
import { formatearFecha, formatearFechayHora } from '../../Fixes/formatter'

function ModelosPage () {
  const { control, errors, reset, handleSubmit } = useForm()
  const inputsTest = [
    {
      name: `pDNI`,
      control: control,
      label: 'DNI',
      type: 'text',
      error: errors?.pDNI,
      readOnly: false
    },
    {
      name: `pFechaNacimientoMin`,
      control: control,
      label: 'Fecha Nacimiento Minima',
      type: 'date',
      error: errors?.pFechaNacimientoMin,
      readOnly: false
    },
    {
      name: `pFechaNacimientoMax`,
      control: control,
      label: 'Fecha Nacimiento Maxima',
      type: 'date',
      error: errors?.pFechaNacimientoMax,
      readOnly: false
    },
    {
      name: `pSexo`,
      control: control,
      label: 'Sexo',
      type: 'select',
      error: errors?.pSexo,
      options: SexoOptions,
      readOnly: false
    },
    {
      name: `pEstado`,
      control: control,
      label: 'Estado',
      type: 'select',
      error: errors?.pEstado,
      options: EstadosModelosOptions,
      readOnly: false
    }
  ]

  const [Modal, setModal] = useState(false)
  const [ModalFinalizar, setModalFinalizar] = useState(false)
  const [Seleccionado, setSeleccionado] = useState(null)
  const [pEstado, setpEstado] = useState('T')
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
  } = useFetch(`${API_URL}/api/modelos/busqueda`, 'get', {
    pCantidad: 10,
    pPagina: 1
  })
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

  const columns = useMemo(
    () => [
      { accessorKey: 'IdModelo', header: '#' },
      { accessorKey: 'DNI', header: 'DNI' },
      { accessorKey: 'ApelName', header: 'Apellido, nombre' },
      { accessorKey: 'FechaNacimiento', header: 'Fecha Nacimiento',
        Cell: ({ cell }) => formatearFecha(cell.getValue())
       },
      {
        accessorKey: 'Sexo',
        header: 'Sexo',
        Cell: ({ cell }) => getLabelByValue(SexoOptions, cell.getValue())
      },
      { accessorKey: 'Telefono', header: 'Telefono' },
      { accessorKey: 'Correo', header: 'Correo' },
      {
        accessorKey: 'EstadoMod',
        header: 'Estado',
        Cell: ({ cell }) =>
          getLabelByValue(EstadosModelosOptions, cell.getValue())
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
                  titulo: `Modelo ${row.original.ApelName}`
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
                  titulo: `Modificar a ${row.original.ApelName}`
                })
              }
            >
              Modificar
            </Button>

            <Button
              estilo='danger'
              onClick={() => {
                doubleConfirmationAlert({
                  textoConfirmacion: `¿Estas seguro de eliminar el modelo ${row.original.ApelName}?`,
                  textoSuccess: 'Se elimino el modelo correctamente',
                  textoError: 'No se elimino el modelo.',
                  funcion: () => deleteModeloApi(row.original.IdModelo),
                  refresh: refresh
                })
              }}
            >
              Borrar
            </Button>
            {row.original.EstadoMod == 'A' ? (
              <Button
                estilo='warning'
                onClick={() => {
                  doubleConfirmationAlert({
                    textoConfirmacion: `¿Estas seguro de dar de baja el modelo ${row.original.ApelName}?`,
                    textoSuccess: 'Se dio de baja el modelo correctamente',
                    textoError: 'No se dio de baja el modelo.',
                    funcion: () => darBajaModeloApi(row.original.IdModelo),
                    refresh: refresh
                  })
                }}
                disabled={row.original.EstadoMod == 'B'}
              >
                Dar Baja
              </Button>
            ) : (
              ''
            )}
            {row.original.EstadoMod == 'B' ? (
              <Button
                estilo='success'
                onClick={() => {
                  doubleConfirmationAlert({
                    textoConfirmacion: `¿Estas seguro de activar el modelo ${row.original.ApelName}?`,
                    textoSuccess: 'Se activo el modelo correctamente',
                    textoError: 'No se activo el modelo.',
                    funcion: () => activarModeloApi(row.original.IdModelo),
                    refresh: refresh
                  })
                }}
                disabled={row.original.EstadoMod == 'A'}
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
    handleFilterParams({ ...data, pCantidad: 10, pPagina: 1 })
    // Aquí puedes manejar los datos del formulario
  }

  function fastSearch (e) {
    setBusqueda(e.target.value)
    handleFilterParams({ pApelName: e.target.value })
  }

  const inputsFormulario = [
    {
      name: 'DNI',
      label: 'DNI',
      type: 'text',
      estilos: 'col-12',
      options: []
    },
    {
      name: 'ApelName',
      label: 'Apellido, nombre',
      type: 'text',
      estilos: 'col-12',
      options: []
    },
    {
      name: 'FechaNacimiento',
      label: 'Fecha Nacimiento',
      type: 'date',
      estilos: 'col-12',
      options: []
    },
    {
      name: 'Sexo',
      label: 'Sexo',
      type: 'select',
      estilos: 'col-12',
      options: SexoOptions
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
      label: 'Correo electronico',
      type: 'mail',
      estilos: 'col-12',
      options: []
    }
  ]

  return (
    <>
      <div>
        <HeaderPageComponent
          title='Modelos'
          items={[{ name: 'modelos', link: '/modelos' }]}
        />
        <SectionPage header={'Listado de modelos registradas'}>
          <div className='d-flex justify-content-start'>
            <Button
              lg
              onClick={() =>
                openForm(null, {
                  soloVer: false,
                  modificar: false,
                  titulo: 'Registrar modelo'
                })
              }
            >
              Registrar modelos
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
              placeholder='Busqueda de modelos por apellido y nombre'
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
          id={'IdModelo'}
          functionCreate={storeModeloApi}
          functionUpdate={updateModeloApi}
          elemento={'Modelo'}
        />
      </ModalModificado>
    </>
  )
}

export default ModelosPage
