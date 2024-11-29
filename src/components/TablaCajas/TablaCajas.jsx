import { useMemo } from "react"
import TablaMaterial from "../TablaMaterial/TablaMaterial"
import { formatearFechayHora } from "../../Fixes/formatter"
import { ESTADO_CAJA_CHOICE, getLabelByValue } from "../../Fixes/fixes"
import { useFetch } from "../../hooks/useFetch"
import { API_URL } from "../../Fixes/API_URL"

function TablaCajas({select=false,rowSelection={}, setRowSelection=null}) {
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


    const columns = useMemo(
        () => [
          { accessorKey: 'IdCaja', header: '#', size: 30 },
          { accessorKey: 'Ubicacion', header: 'Ubicacion' },
          { accessorKey: 'NumeroCaja', header: 'Numero de caja', size: 70 },
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
            header: 'Estado',
            Cell: ({ cell }) => getLabelByValue(ESTADO_CAJA_CHOICE,cell.getValue())
          },
        //   {
        //     accessorKey: 'acciones',
        //     header: 'Acciones',
        //     enableSorting: false,
        //     enableHiding: false,
        //     size: '220',
        //     enableGlobalFilter: false,
        //     Cell: ({ row, table }) => (
        //       <ButtonGroup
        //         style={{ display: 'flex', justifyContent: 'flex-end' }}
        //         className='pe-5'
        //       >
        //         <Button
        //           estilo='primary'
        //           onClick={() => openForm(row, { soloVer: true, titulo: `Caja ${row.original?.NumeroCaja}` })}
        //         >
        //           Ver
        //         </Button>
        //         <Button
        //           estilo='secondary'
        //           onClick={() => openForm(row, { modificar: true ,titulo: `Modificar Caja ${row.original?.NumeroCaja}` })}
        //         >
        //           Modificar
        //         </Button>
    
        //         <Button estilo='danger' onClick={() => deleteItem(row.original)}>
        //           Borrar
        //         </Button>
        //       </ButtonGroup>
        //     )
        //   }
        ],
        []
      )
  return (
    <TablaMaterial
    select={select}
    rowSelection={rowSelection}
    setRowSelection={setRowSelection}
    columnFilters={columnFilters}
    loading={loading}
    pagination={pagination}
    setColumnFilters={setColumnFilters}
    setPagination={setPagination}
    setSorting={setSorting}
    sorting={sorting}
    columns={columns}
    data={data}
    DefaultId="IdCaja"
  />
  )
}

export default TablaCajas