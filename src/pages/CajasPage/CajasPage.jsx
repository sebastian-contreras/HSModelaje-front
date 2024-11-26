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
import Swal from 'sweetalert2'
import { deleteCajaApi } from '../../services/CajasService'
import { Alerta } from '../../functions/alerts'
import { MENSAJE_DEFAULT } from '../../Fixes/messages'

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

  function openForm (e = null, { soloVer = false, modificar = false }) {
    reset(e?.original)
    setCajaSeleccionada(e?.original)
    setModalCaja({ soloVer, modificar })
  }

  function closeForm () {
    reset()
    setCajaSeleccionada(null)
    setModalCaja(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const deleteItem = carteraBorro => {
    Swal.fire({
      title: `¿Estas seguro de eliminar la caja ${carteraBorro.NumeroCaja}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
        if(result.isConfirmed){
          deleteCajaApi(carteraBorro.IdCaja).then(response => {
            Alerta()
             .withMini(true)
             .withTipo('success')
             .withTitulo('Se elimino la caja correctamente')
             .withMensaje(response.message)
             .build()
            refresh()
          })
        }
    })
    .catch((err)=>{
      Alerta()
      .withMini(true)
      .withTipo('error')
      .withTitulo('No se elimino la caja.')
      .withMensaje(err?.response?.data?.message ? err.response.data.message : MENSAJE_DEFAULT)
      .build()
    })
  }


  const columns = useMemo(
    () => [
      { accessorKey: 'IdCaja', header: '#', size: 30 },
      { accessorKey: 'Ubicacion', header: 'Ubicacion' },
      { accessorKey: 'NumeroCaja', header: 'NumeroCaja', size: 60 },
      { accessorKey: 'Tamaño', header: 'Tamaño' },
      { accessorKey: 'Fila', header: 'Fila' },
      { accessorKey: 'Columna', header: 'Columna' },
      {
        accessorKey: 'created_at',
        header: 'Creada',
        Cell: ({ cell }) => formatearFechayHora(cell.getValue())
      },
      {
        accessorKey: 'EstadoCaja',
        header: 'EstadoCaja',
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
            <Button
              estilo='primary'
              onClick={() => openForm(row, { soloVer: true })}
            >
              Ver
            </Button>
            <Button
              estilo='secondary'
              onClick={() => openForm(row, { modificar: true })}
            >
              Modificar
            </Button>

            <Button estilo='danger' onClick={() => deleteItem(row.original)}>
              Borrar
            </Button>
          </ButtonGroup>
        )
      }
    ],
    [deleteItem, openForm]
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
            <Button
              lg
              onClick={() =>
                openForm(null, { soloVer: false, modificar: false })
              }
            >
              Crear Caja
            </Button>
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
        <FormCaja
          closeModal={closeForm}
          soloVer={ModalCaja.soloVer}
          modificar={ModalCaja.modificar}
          dataform={CajaSeleccionada}
          refresh={refresh}
        />
      </ModalModificado>
    </>
  )
}

export default CajasPage
