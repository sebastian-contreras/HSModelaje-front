import { useMemo, useState } from 'react'
import { API_URL } from '../../Fixes/API_URL.JS'
import { useFetch } from '../../hooks/useFetch'
import { ButtonGroup, Modal } from 'react-bootstrap'
import Button from '../../components/Button/Button'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import SectionPage from '../../components/SectionPage/SectionPage'
import TablaMaterial from '../../components/TablaMaterial/TablaMaterial'
import { formatearFechayHora } from '../../Fixes/formatter'
import ModalModificado from '../../components/Modal/ModalModificado'
import { useForm } from 'react-hook-form'
import InputCaja from '../../components/Formularios/FormCajas/InputCaja'
import { getLabelByValueEstados } from '../../Fixes/fixes'
import FormCaja from '../../components/Formularios/FormCajas/FormCaja'

function CajasPage () {
  const [ModalVerCaja, setModalVerCaja] = useState(false)
  const [ModalCaja, setModalCaja] = useState(false)
  const [CajaSeleccionada, setCajaSeleccionada] = useState(null)
  const { control, errors, reset } = useForm()

  const {
    data,
    loading,
    error,
    params,
    body,
    refresh,
    handlePagination,
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting
  } = useFetch(`${API_URL}/api/cajas`, 'get')
  function handleVer (e) {
    reset(e.original)
    setCajaSeleccionada(e.original)
    setModalCaja(e.original)
  }
  
  function openForm (e=null,{soloVer=false,modificar=false}) {
    reset(e?.original)
    setCajaSeleccionada(e?.original)
    setModalCaja({soloVer,modificar})
  }
  
  function closeForm () {
    reset()
    setCajaSeleccionada(null)
    setModalCaja(false)
  }

  const columns = useMemo(
    () => [
      { accessorKey: 'IdCaja', header: '#', size: 30 },
      { accessorKey: 'NumeroCaja', header: 'NumeroCaja' },
      { accessorKey: 'Tamaño', header: 'Tamaño' },
      { accessorKey: 'Fila', header: 'Fila' },
      { accessorKey: 'Columna', header: 'Columna' },
      {
        accessorKey: 'created_at',
        header: 'Creada',
        Cell: ({ cell }) => formatearFechayHora(cell.getValue())
      },
      { accessorKey: 'EstadoCaja', header: 'EstadoCaja',
        Cell: ({ cell }) => getLabelByValueEstados(cell.getValue())
       },
      {
        accessorKey: 'acciones',
        header: 'Acciones',
        enableSorting: false,
        enableHiding: false,
        size: '220',
        enableGlobalFilter: false,
        Cell: ({ row, table }) => (
          <ButtonGroup
            style={{ display: 'flex', justifyContent: 'flex-end' }}
            className='pe-5'
          >
            <Button estilo='primary' onClick={() => openForm(row,{soloVer:true})}>
              Ver
            </Button>
            <Button estilo='secondary' onClick={() => console.log(row)}>
              Modificar
            </Button>

            <Button estilo='danger' onClick={() => console.log(row)}>
              Borrar
            </Button>
          </ButtonGroup>
        )
      }
    ],
    []
  )
  return (
    <>
      <div>
        <HeaderPageComponent
          title='Cajas'
          items={[{ name: 'Cajas', link: '/cajas' }]}
        />
        <SectionPage header={'Listado de cajas registradas'}>
          <div className='d-flex justify-content-start'>
            <Button lg onClick={()=>openForm(null,{soloVer:false,modificar:false})}>Crear Caja</Button>
          </div>
          <TablaMaterial
            columnFilters={columnFilters}
            loading={loading}
            pagination={pagination}
            setColumnFilters={setColumnFilters}
            setPagination={setPagination}
            setSorting={setSorting}
            sorting={sorting}
            columns={columns}
            data={data}
          />
        </SectionPage>
      </div>

      <ModalModificado
        show={ModalCaja}
        handleClose={closeForm}
        size={50}
        title='Nueva caja'
        // title={`Detalle de ${CajaSeleccionada?.NumeroCaja ||''}, Fila: ${CajaSeleccionada?.Fila ||''}, Columna: ${CajaSeleccionada?.Columna ||''}`}
      >
        <FormCaja closeModal={closeForm} soloVer={ModalCaja.soloVer} modificar={ModalCaja.modificar} dataform={CajaSeleccionada} refresh={refresh}/>
      </ModalModificado>
    </>
  )
}

export default CajasPage
