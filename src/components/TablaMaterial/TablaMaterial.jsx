import { MaterialReactTable, useMaterialReactTable } from "material-react-table"

function TablaMaterial({select=false,DefaultId='id',rowSelection, setRowSelection,data=[],columns=[],loading,pagination,sorting,columnFilters,setSorting,setColumnFilters,setPagination}) {
    
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
        data: data || [], //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        // enableRowSelection: true, //enable some features
        // enableColumnOrdering: true, //enable a feature for all columns
        // enableGlobalFilter: true, //turn off a feature
        muiPaginationProps: {
          color: 'primary',
          shape: 'rounded',
          showRowsPerPage: true,
          variant: 'outlined'
        },
        paginationDisplayMode: 'pages',
        manualPagination: true,
        initialState: {
          columnPinning: {right: ['acciones'] },
          density:'compact'
        },
     
        getRowId: (originalRow) => originalRow[DefaultId],
      })

  return (
    <div style={{ overflowX: 'auto' }}>
    <MaterialReactTable table={table} />
  </div>
  )
}

export default TablaMaterial