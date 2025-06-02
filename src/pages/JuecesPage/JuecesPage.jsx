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
  EstadosJuecesOptions,
} from '../../Fixes/fixes'
import { doubleConfirmationAlert } from '../../functions/alerts'
import { useFetch } from '../../hooks/useFetch'
import {
  activarJuezApi,
  darBajaJuezApi,
  deleteJuezApi,
  storeJuezApi,
  updateJuezApi
} from '../../services/JuecesService'
import { useEvento } from '../../context/SidebarContext/EventoContext'

function JuecesPage () {
  const { evento } = useEvento() // Usa el contexto
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
      name: `pApelName`,
      control: control,
      label: 'Apellido, nombre',
      type: 'text',
      error: errors?.pApelName,
      options: [],
      readOnly: false
    },
    {
      name: `pEstado`,
      control: control,
      label: 'Estado',
      type: 'select',
      error: errors?.pEstado,
      options: EstadosJuecesOptions,
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
  } = useFetch(`${API_URL}/api/jueces/busqueda`, 'get', {
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
      { accessorKey: 'IdJuez', header: '#' },
      { accessorKey: 'DNI', header: 'DNI' },
      { accessorKey: 'ApelName', header: 'Apellido, nombre' },
      { accessorKey: 'Correo', header: 'Correo' },
      { accessorKey: 'Telefono', header: 'Telefono' },
      { accessorKey: 'EstadoJuez', header: 'Estado' },
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
                  titulo: `Juez ${row.original.ApelName}`
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
              estilo='success'
              onClick={() =>
                openForm(row, {
                  modificar: true,
                  titulo: `Modificar a ${row.original.ApelName}`
                })
              }
            >
              Invitacion
            </Button>


            <Button
              estilo='danger'
              onClick={() => {
                doubleConfirmationAlert({
                  textoConfirmacion: `¿Estas seguro de eliminar el juez ${row.original.ApelName}?`,
                  textoSuccess: 'Se elimino el juez correctamente',
                  textoError: 'No se elimino el juez.',
                  funcion: () => deleteJuezApi(row.original.IdJuez),
                  refresh: refresh
                })
              }}
            >
              Borrar
            </Button>
            {row.original.EstadoJuez == 'A' ? (
              <Button
                estilo='warning'
                onClick={() => {
                  doubleConfirmationAlert({
                    textoConfirmacion: `¿Estas seguro de dar de baja el juez ${row.original.ApelName}?`,
                    textoSuccess: 'Se dio de baja el juez correctamente',
                    textoError: 'No se dio de baja el juez.',
                    funcion: () => darBajaJuezApi(row.original.IdJuez),
                    refresh: refresh
                  })
                }}
                disabled={row.original.EstadoJuez == 'B'}
              >
                Dar Baja
              </Button>
            ) : (
              ''
            )}
            {row.original.EstadoJuez == 'B' ? (
              <Button
                estilo='success'
                onClick={() => {
                  doubleConfirmationAlert({
                    textoConfirmacion: `¿Estas seguro de activar el juez ${row.original.ApelName}?`,
                    textoSuccess: 'Se activo el juez correctamente',
                    textoError: 'No se activo el juez.',
                    funcion: () => activarJuezApi(row.original.IdJuez),
                    refresh: refresh
                  })
                }}
                disabled={row.original.EstadoJuez == 'A'}
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
    handleFilterParams({ pApelName: e.target.value,pIdEvento:evento.IdEvento })
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
          title='Jueces'
          items={[{ name: 'jueces', link: '/jueces' }]}
        />
        <SectionPage header={'Listado de jueces registradas'}>
          <div className='d-flex justify-content-start'>
            <Button
              lg
              onClick={() =>
                openForm(null, {
                  soloVer: false,
                  modificar: false,
                  titulo: 'Registrar juez'
                })
              }
            >
              Registrar jueces
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
              placeholder='Busqueda de jueces por apellido y nombre'
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
          id={'IdJuez'}
          functionCreate={e =>
            storeJuezApi({ IdEvento: evento.IdEvento, ...e })
          }
          functionUpdate={updateJuezApi}
          elemento={'Juez'}
        />
      </ModalModificado>
    </>
  )
}

export default JuecesPage
