import { useMemo, useState } from 'react'
import { ButtonGroup, Dropdown, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Button from '../../components/Button/Button'
import GenerateForms from '../../components/GenerateForms/GenerateForms'
import GenerateInputs from '../../components/GenerateInputs/GenerateInputs'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import ModalModificado from '../../components/Modal/ModalModificado'
import SectionPage from '../../components/SectionPage/SectionPage'
import TablaMaterial from '../../components/TablaMaterial/TablaMaterial'
import { API_URL } from '../../Fixes/API_URL'
import Select from 'react-select'

import { Alerta, doubleConfirmationAlert } from '../../functions/alerts'
import { useFetch } from '../../hooks/useFetch'
import { useEvento } from '../../context/SidebarContext/EventoContext'
import {
  buscarParticipanteApi,
  deleteParticipanteApi,
  storeParticipanteApi
} from '../../services/ParticipantesService'
import { buscarModeloApi } from '../../services/ModelosService'
import { MENSAJE_DEFAULT } from '../../Fixes/messages'

function ParticipantesPage () {
  const { evento } = useEvento() // Usa el contexto
  const { control, errors, reset, handleSubmit, watch } = useForm()
  const [ModelosFiltrados, setModelosFiltrados] = useState([])

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
  } = useFetch(`${API_URL}/api/participantes/busqueda`, 'get', {
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
      { accessorKey: 'IdParticipante', header: '#' },
      { accessorKey: 'DNI', header: 'DNI' },
      { accessorKey: 'ApelName', header: 'Apellido, nombre' },
      { accessorKey: 'Promotor', header: 'Promotor' },
      { accessorKey: 'Correo', header: 'Correo' },
      { accessorKey: 'Telefono', header: 'Telefono' },
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
                  titulo: `Participante ${row.original.ApelName}`
                })
              }
            >
              Ver
            </Button>

            <Button
              estilo='danger'
              onClick={() => {
                doubleConfirmationAlert({
                  textoConfirmacion: `¿Estas seguro de eliminar el participante ${row.original.ApelName}?`,
                  textoSuccess: 'Se elimino el participante correctamente',
                  textoError: 'No se elimino el participante.',
                  funcion: () =>
                    deleteParticipanteApi(row.original.IdParticipante),
                  refresh: refresh
                })
              }}
            >
              Borrar
            </Button>
          </ButtonGroup>
        )
      }
    ],
    [refresh]
  )

  function filterModelos (e) {
    buscarModeloApi({ pDNI: e, Pagina: 1, Cantidad: 10 }).then(res => {
      setModelosFiltrados(
        res.data.data.map(e => ({
          value: e.IdModelo,
          label: `${e.DNI} - ${e.ApelName}`
        }))
      )
    })
  }

  const inputsTest = [
    {
      name: 'IdModelo',
      label: 'Busqueda de modelos por DNI',
      type: 'select-autocomplete',
      onFilterChange: filterModelos,
      estilos: 'col-12',
      options: ModelosFiltrados
    },
    {
      name: `Promotor`,
      control: control,
      label: 'Promotor',
      type: 'text',
      error: errors?.Promotor,
      options: [],
      readOnly: false
    }
  ]

  function submitParticipante (data) {
    const newParticipante = {
      IdEvento: evento.IdEvento,
      IdModelo: data.IdModelo.value,
      Promotor: data.Promotor
    }
    storeParticipanteApi(newParticipante)
      .then(response => {
        console.log(data)
        if (closeForm) closeForm()
        if (refresh) refresh()
        Alerta()
          .withMini(true)
          .withTipo('success')
          .withTitulo(
            response.message
              ? response.message
              : 'Participante Creado exitosamente'
          )
          .build()
      })
      .catch(error => {
        console.log(error)
        Alerta()
          .withMini(true)
          .withTipo('error')
          .withTitulo('No se pudo creae el participante')
          .withMensaje(
            error.response.data.message
              ? error.response.data.message
              : MENSAJE_DEFAULT
          )
          .build()
      })
  }
  console.log(Seleccionado)

  return (
    <>
      <div>
        <HeaderPageComponent
          title='Participantes'
          items={[{ name: 'participantes', link: '/participantes' }]}
        />
        <SectionPage header={'Listado de participantes registradas'}>
          <div className='d-flex justify-content-start'>
            <Button
              lg
              onClick={() =>
                openForm(null, {
                  soloVer: false,
                  modificar: false,
                  titulo: 'Registrar participante'
                })
              }
            >
              Registrar participantes
            </Button>
          </div>

          {/* <div className='input-group mb-0 mt-5'>
        
            <span className='input-group-text'>
              <i className='fas fa-search'></i>
            </span>
            <input
              type='text'
              value={Busqueda}
              className='form-control'
              onChange={fastSearch}
              placeholder='Busqueda de participantes por apellido y nombre'
            />
          </div> */}

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
          CustomSubmit={submitParticipante}
          refresh={refresh}
          inputs={inputsTest}
          id={'IdParticipante'}
          functionCreate={e =>
            storeParticipanteApi({ IdEvento: evento.IdEvento, ...e })
          }
          elemento={'Participante'}
          CustomReset={{
            IdModelo: {
              value: Seleccionado?.IdModelo,
              label: `${Seleccionado?.DNI} - ${Seleccionado?.ApelName}`
            },
            Promotor: Seleccionado?.Promotor,
          }}
        />
      </ModalModificado>
    </>
  )
}

export default ParticipantesPage
