import { ButtonGroup } from 'react-bootstrap'
import HeaderPageComponent from '../../../components/HeaderPageComponent/HeaderPageComponent'
import SectionPage from '../../../components/SectionPage/SectionPage'
import TablaMaterial from '../../../components/TablaMaterial/TablaMaterial'
import Button from '../../../components/Button/Button'
import { formatearFechayHora } from '../../../Fixes/formatter'
import { EstadosOptions, getLabelByValueEstados } from '../../../Fixes/fixes'
import { useMemo, useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { API_URL } from '../../../Fixes/API_URL.JS'

function ListadoContratoPage () {
  const [Modal, setModal] = useState(false)
  const [Seleccionado, setSeleccionado] = useState(null)
  const {
    data,
    loading,
    error,
    params,
    body,
    handlePagination,
    pagination,
    setPagination,
    columnFilters,
    refresh,
    setColumnFilters,
    sorting,
    setSorting
  } = useFetch(`${API_URL}/api/contratos`, 'get')
  // const [sorting, setSorting] = useState([])

  function closeForm () {
    setSeleccionado(null)
    setModal(false)
  }

  function openForm (
    e = null,
    { soloVer = false, modificar = false, titulo = 'No hay titulo' }
  ) {
    setSeleccionado(e?.original)
    setModal({ soloVer, modificar, titulo })
  }

  const columns = useMemo(
    () => [
      { accessorKey: 'IdContrato', header: '#' },
      {
        accessorFn: row => row.asociados[0]?.persona.CUIT, // Usar accessorFn para acceder al primer elemento de asociados
        id: 'CUIT',
        header: 'CUIT'
      },
      {
        accessorFn: row => `${row.asociados[0]?.persona.Apellido}, ${row.asociados[0]?.persona.Nombre}`, // Usar accessorFn para acceder al primer elemento de asociados
        id: 'apelname',
        header: 'Titular'
      },
      {
        accessorFn: row => row.asociados[0]?.TipoAsociacion, // Usar accessorFn para acceder al primer elemento de asociados
        id: 'TipoAsociacion',
        header: 'Tipo de asociacion'
      },
      { accessorKey: 'caja.NumeroCaja', header: 'Caja' },
      { accessorKey: 'caja.Fila', header: 'Fila' },
      { accessorKey: 'caja.Columna', header: 'Columna' },
      { accessorKey: 'EstadoContrato', header: 'Estado'
        ,Cell: ({ cell }) => getLabelByValueEstados(cell.getValue())

       },

      {
        accessorKey: 'created_at',
        header: 'Creado el',
        Cell: ({ cell }) => formatearFechayHora(cell.getValue())
      },
      // { accessorKey: 'updated_at', header: 'Actualizado el' },
      // { accessorKey: 'deleted_at', header: 'Eliminado el' },
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
              onClick={() =>
                openForm(row, {
                  soloVer: true,
                  titulo: `Detalle de ${row.original.CUIT} - ${row.original.Apellido}, ${row.original.Nombre}`
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
                  titulo: `Modificar a ${row.original.CUIT} - ${row.original.Apellido}, ${row.original.Nombre}`
                })
              }
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
    []
  )
  return (
    <div>
      <HeaderPageComponent
        title='Contratos'
        items={[{ name: 'Contratos', link: '/contratos' }]}
      />
      <SectionPage header={'Lista de contratos registradas'}>
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
  )
}

export default ListadoContratoPage
