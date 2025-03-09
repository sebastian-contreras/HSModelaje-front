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
  SexoOptions
} from '../../Fixes/fixes'
import { doubleConfirmationAlert } from '../../functions/alerts'
import { useFetch } from '../../hooks/useFetch'
import { activarModeloApi, darBajaModeloApi, deleteModeloApi, storeModeloApi, updateModeloApi } from '../../services/ModelosService'
import { useEvento } from '../../context/SidebarContext/EventoContext'
import { deleteGastoApi, storeGastoApi, updateGastoApi } from '../../services/GastosService'

function GastosPage () {
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
  } = useFetch(`${API_URL}/api/gastos/busqueda`, 'get', {
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
      { accessorKey: 'IdGasto', header: '#' },
      { accessorKey: 'Gasto', header: 'Gasto' },
      { accessorKey: 'Personal', header: 'Personal' },
      { accessorKey: 'Monto', header: 'Monto' },
      {
        accessorKey: 'acciones',
        header: 'Acciones',
        enableSorting: false,
        size: '300',
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
                  titulo: `Gasto ${row.original.Gasto}`
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
                  titulo: `Modificar a ${row.original.Gasto}`
                })
              }
            >
              Modificar
            </Button>

            <Button
              estilo='danger'
              onClick={() => {
                doubleConfirmationAlert({
                  textoConfirmacion: `¿Estas seguro de eliminar el gasto ${row.original.Gasto}?`,
                  textoSuccess: 'Se elimino el gasto correctamente',
                  textoError: 'No se elimino el gasto.',
                  funcion: () => deleteGastoApi(row.original.IdGasto),
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
    handleFilterParams({pGasto:e.target.value,pIdEvento:evento?.IdEvento})
  }

  const inputsFormulario = [
    {
      name: 'Gasto',
      label: 'Gasto',
      type: 'text',
      estilos: 'col-12',
      options: [],
    },
    {
      name: 'Personal',
      label: 'Personal',
      type: 'text',
      estilos: 'col-12',
      options: [],
    },
    {
      name: 'Monto',
      label: 'Monto',
      type: 'number',
      estilos: 'col-12',
      options: [],
    },
    {
      name: 'Comprobante',
      label: 'Comprobante',
      type: 'file',
      estilos: 'col-12',
      options: [],
    },
    
  ]

  return (
    <>
    <div>
      <HeaderPageComponent
        title='Gastos'
        items={[{ name: 'gastos', link: '/gastos' }]}
      />
      <SectionPage header={'Listado de gastos registradas'}>
        <div className='d-flex justify-content-start'>
          <Button
            lg
            onClick={() =>
              openForm(null, {
                soloVer: false,
                modificar: false,
                titulo: 'Registrar gasto'
              })
            }
          >
            Registrar gastos
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
            placeholder='Busqueda de gastos'
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
          id={'IdGasto'}
          functionCreate={(data)=>storeGastoApi({IdEvento:evento?.IdEvento,...data})}
          functionUpdate={updateGastoApi}
          elemento={'Gasto'}
        />
      </ModalModificado>

    </>
  )
}

export default GastosPage
