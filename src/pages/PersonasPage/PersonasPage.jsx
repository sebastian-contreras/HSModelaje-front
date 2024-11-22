import { useMemo, useState } from 'react'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import SectionPage from '../../components/SectionPage/SectionPage'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { ButtonGroup } from 'react-bootstrap'
import Button from '../../components/Button/Button'
import { useFetch } from '../../hooks/useFetch'

function PersonasPage () {
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
    sorting, setSorting
  } = useFetch('http://localhost:8000/api/personas', 'get')
// const [sorting, setSorting] = useState([])
console.log(sorting)
  const columns = useMemo(
    () => [
      { accessorKey: 'IdPersona', header: 'ID Persona' },
      { accessorKey: 'CUIT', header: 'CUIT' },
      { accessorKey: 'Apellido', header: 'Apellido' },
      { accessorKey: 'Nombre', header: 'Nombre' },
      { accessorKey: 'Nacionalidad', header: 'Nacionalidad' },
      // { accessorKey: 'Actividad', header: 'Actividad' },
      // { accessorKey: 'Domicilio', header: 'Domicilio' },
      // { accessorKey: 'Email', header: 'Email' },
      // { accessorKey: 'Telefono', header: 'Teléfono' },
      // { accessorKey: 'Movil', header: 'Móvil' },
      // { accessorKey: 'SituacionFiscal', header: 'Situación Fiscal' },
      // { accessorKey: 'FNacimiento', header: 'Fecha de Nacimiento' },
      // { accessorKey: 'DNI', header: 'DNI' },
      // { accessorKey: 'Alias', header: 'Alias' },
      // { accessorKey: 'CodPostal', header: 'Código Postal' },
      // { accessorKey: 'PEP', header: 'PEP' },
      // { accessorKey: 'EstadoPersona', header: 'Estado Persona' },
      // { accessorKey: 'created_at', header: 'Creado el' },
      // { accessorKey: 'updated_at', header: 'Actualizado el' },
      // { accessorKey: 'deleted_at', header: 'Eliminado el' },
      {
        accessorKey: 'acciones',
        header: 'Acciones',
        enableSorting: false,
        enableHiding: false,
        size:'220',
        enableGlobalFilter: false,
        Cell: ({ row, table }) => (
          <ButtonGroup
            style={{ display: 'flex', justifyContent: 'flex-end' }}
            className='pe-5'
          >
            <Button  estilo='primary' onClick={() => console.log(row)}>
              Ver
            </Button>
            <Button  estilo='secondary' onClick={() => console.log(row)}>
              Modificar
            </Button>

            <Button  estilo='danger' onClick={() => console.log(row)}>
              Borrar
            </Button>
          </ButtonGroup>
        )
      }
    ],
    []
  )
  //pass table options to useMaterialReactTable
  const table = useMaterialReactTable({
    columns,
        enableColumnPinning: true,
        enableColumnResizing: true,
    muiTableHeadProps: {
      sx: {
        width: '100%',
        fontWeight: 'bold',
        fontSize: '15px',
        color:'white',
        backgroundColor:'#6861ce'
      }
    },
    muiTableHeadRowProps:{
      sx: {
        fontWeight: 'bold',
        fontSize: '15px',
        color:'white',
        backgroundColor:'#6861ce'
      }
    },
    muiTableHeadCellProps: {
      //simple styling with the `sx` prop, works just like a style prop in this example
      sx: {
        '&[data-pinned="true"]': {
          backgroundColor: '#6861ce', // Asegura que las celdas pineadas tengan el mismo color
        },        fontWeight: 'bold',
        fontSize: '15px',
        color:'white',
        backgroundColor:'#6861ce'
      }
    },
    data: data?.data || [], //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    // enableRowSelection: true, //enable some features
    // enableColumnOrdering: true, //enable a feature for all columns
    enableGlobalFilter: true, //turn off a feature
    muiPaginationProps: {
      color: 'primary',
      shape: 'rounded',
      showRowsPerPage: false,
      variant: 'outlined'
    },
    paginationDisplayMode: 'pages',
    manualPagination: true,
    rowCount: data.ultimo_registro,
    initialState: {
      columnPinning: {right: ['acciones'] },
    },
    manualSorting:true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: { pagination, isLoading: loading, columnFilters, sorting }, //pass the pagination state to the table
    manualFiltering: true, //turn off client-side filtering
    onColumnFiltersChange: setColumnFilters //hoist internal columnFilters state to your state
  })
  console.log(columnFilters)
  return (
    <div>
      <HeaderPageComponent
        title='Personas'
        items={[{ name: 'Personas', link: '/personas' }]}
      />
      <SectionPage header={'Listado de personas registradas'}>
        <div style={{ overflowX: 'auto' }}>
          <MaterialReactTable table={table} />
        </div>
      </SectionPage>
    </div>
  )
}

export default PersonasPage
