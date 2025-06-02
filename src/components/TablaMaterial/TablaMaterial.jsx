import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'

function TablaMaterial ({
  rowSelection,
  enableMultiRowSelection = false,
  setRowSelection,
  data = [],
  columns = [],
  loading,
  pagination,
  columnFilters,
  setColumnFilters,
  setPagination,
  enableEditing = false,
  rowCount = 0
}) {
  const table = useMaterialReactTable({
    columns,
    enableEditing: enableEditing,
    enableColumnPinning: true,
    enableColumnResizing: true,
    columnResizeMode: 'onChange', // o 'onEnd'
        layoutMode: "autowidth", // O "autoWidth" si está disponible
    enableMultiRowSelection: enableMultiRowSelection,
    muiTopToolbarProps: {
      sx: {
        backgroundColor: 'rgb(243, 244, 252)'
      }
    },
    muiBottomToolbarProps: {
      sx: {
        backgroundColor: 'rgb(243, 244, 252)'
      }
    },
    muiTableHeadProps: {
      sx: {
        width: '100%',
        fontWeight: 'bold',
        fontSize: '15px',
        color: 'white',
        backgroundColor: '#6861ce'
      }
    },
    muiTableHeadRowProps: {
      sx: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: 'white',
        backgroundColor: '#6861ce'
      }
    },
    muiTableHeadCellProps: {
      //simple styling with the `sx` prop, works just like a style prop in this example
      sx: {
        '&[data-pinned="true"]': {
          backgroundColor: '#6861ce' // Asegura que las celdas pineadas tengan el mismo color
        },
        fontWeight: 'bold',
        fontSize: '15px',
        color: 'white',
        backgroundColor: '#6861ce'
      }
    },
    data: data || [], //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    // enableColumnOrdering: true, //enable a feature for all columns
    enableGlobalFilter: true, //turn off a feature
    muiPaginationProps: {
      color: 'primary',
      shape: 'rounded',
      showRowsPerPage: rowCount ? true : false,
      variant: 'outlined'
    },
    paginationDisplayMode: 'pages',
    manualPagination: true,
    rowCount: rowCount || 1,
    initialState: {
      columnPinning: { right: ['acciones'] },
      density: 'compact'
    },
    onRowSelectionChange: setRowSelection || null,
    onPaginationChange: setPagination,
    state: {
      pagination,
      isLoading: loading,
      columnFilters,
      rowSelection: rowSelection || {}
    }, //pass the pagination state to the table
    manualFiltering: true, //turn off client-side filtering
    onColumnFiltersChange: setColumnFilters //hoist internal columnFilters state to your state
  })

  return (
    <div style={{ overflowX: 'auto' }}>
      <MaterialReactTable table={table} />
    </div>
  )
}

export default TablaMaterial
