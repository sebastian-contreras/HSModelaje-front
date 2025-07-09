import { useMemo, useState } from 'react'
import { ButtonGroup } from 'react-bootstrap'
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
import { deletePatrocinadorApi, storePatrocinadorApi, updatePatrocinadorApi } from '../../services/PatrocinadoresService'
import { formatearFechayHora } from '../../Fixes/formatter'

function PatrocinadoresPage () {
  const { evento } = useEvento() // Usa el contexto
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
  } = useFetch(`${API_URL}/api/patrocinadores/busqueda`, 'get', {
    pIdEvento:evento?.IdEvento,
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
      { accessorKey: 'IdPatrocinador', header: '#' },
      { accessorKey: 'Patrocinador', header: 'Patrocinador' },
      { accessorKey: 'Correo', header: 'Correo' },
      { accessorKey: 'Telefono', header: 'Telefono' },
      { accessorKey: 'DomicilioRef', header: 'Domicilio Referencial' },
      { accessorKey: 'Descripcion', header: 'Descripcion' },
      { accessorKey: 'FechaCreado', header: 'Fecha Creado',
        Cell: ({ cell }) => formatearFechayHora(cell.getValue())
       },
      {
        accessorKey: 'acciones',
        header: 'Acciones',
        enableSorting: false,
        size: '300',
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
                  titulo: `Patrocinador ${row.original.Patrocinador}`
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
                  titulo: `Modificar a ${row.original.Patrocinador}`
                })
              }
            >
              Modificar
            </Button>

            <Button
              estilo='danger'
              onClick={() => {
                doubleConfirmationAlert({
                  textoConfirmacion: `¿Estas seguro de eliminar el patrocinador ${row.original.Patrocinador}?`,
                  textoSuccess: 'Se elimino el patrocinador correctamente',
                  textoError: 'No se elimino el patrocinador.',
                  funcion: () => deletePatrocinadorApi(row.original.IdPatrocinador),
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


  function fastSearch(e){
    setBusqueda(e.target.value)
    handleFilterParams({pPatrocinador:e.target.value,pIdEvento:evento?.IdEvento})
  }

  const inputsFormulario = [
    {
      name: 'Patrocinador',
      label: 'Patrocinador',
      type: 'text',
      estilos: 'col-12',
      options: [],
    },
    {
      name: 'Correo',
      label: 'Correo',
      type: 'email',
      estilos: 'col-12',
      options: [],
    },
    {
      name: 'Telefono',
      label: 'Telefono',
      type: 'text',
      estilos: 'col-12',
      options: [],
    },
    {
      name: 'DomicilioRef',
      label: 'Domicilio Referencial',
      type: 'text',
      estilos: 'col-12',
      options: [],
    },
    {
      name: 'Descripcion',
      label: 'Descripcion',
      type: 'textarea',
      estilos: 'col-12',
      options: [],
    },
    
  ]

  return (
    <>
    <div>
      <HeaderPageComponent
        title='Patrocinadores'
        items={[{ name: 'patrocinadores', link: '/patrocinadores' }]}
      />
      <SectionPage header={'Listado de patrocinadores registrados'}>
        <div className='d-flex justify-content-start'>
          <Button
            lg
            onClick={() =>
              openForm(null, {
                soloVer: false,
                modificar: false,
                titulo: 'Registrar patrocinador'
              })
            }
          >
            Registrar patrocinadores
          </Button>
        </div>

        <div className='input-group mb-0 mt-5'>
          <span className='input-group-text'>
            <i className='fas fa-search'></i>
          </span>
          <input
            type='text'
            value={Busqueda}
            className='form-control'
            onChange={fastSearch}
            placeholder='Ingrese nombre para buscar'
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
          id={'IdPatrocinador'}
          functionCreate={(data)=>storePatrocinadorApi({IdEvento:evento?.IdEvento,...data})}
          functionUpdate={updatePatrocinadorApi}
          elemento={'Patrocinador'}
        />
      </ModalModificado>

    </>
  )
}

export default PatrocinadoresPage
