import { useMemo } from 'react'
import { API_URL } from '../../Fixes/API_URL.JS'
import { useFetch } from '../../hooks/useFetch'
import { ButtonGroup } from 'react-bootstrap'
import Button from '../../components/Button/Button'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import SectionPage from '../../components/SectionPage/SectionPage'
import TablaMaterial from '../../components/TablaMaterial/TablaMaterial'
import { formatearFechayHora } from '../../Fixes/formatter'

function CajasPage () {
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
    setColumnFilters,
    sorting,
    setSorting
  } = useFetch(`${API_URL}/api/cajas`, 'get')

  const columns = useMemo(
    () => [
      { accessorKey: 'IdCaja', header: '#',size:30 },
      { accessorKey: 'NumeroCaja', header: 'NumeroCaja' },
      { accessorKey: 'Tamaño', header: 'Tamaño' },
      { accessorKey: 'Fila', header: 'Fila' },
      { accessorKey: 'Columna', header: 'Columna' },
      { accessorKey: 'created_at', header: 'Creada',Cell:({ cell }) => formatearFechayHora(cell.getValue())},
      { accessorKey: 'EstadoCaja', header: 'EstadoCaja' },
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
            <Button estilo='primary' onClick={() => console.log(row, table)}>
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
    <div>
      <HeaderPageComponent
        title='Cajas'
        items={[{ name: 'Cajas', link: '/cajas' }]}
      />
      <SectionPage header={'Listado de cajas registradas'}>
        <div className="d-flex justify-content-end">
          <Button lg>Crear Caja</Button>
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
  )
}

export default CajasPage
