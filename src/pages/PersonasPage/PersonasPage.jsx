import { useMemo, useState } from 'react'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import SectionPage from '../../components/SectionPage/SectionPage'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { ButtonGroup } from 'react-bootstrap'
import Button from '../../components/Button/Button'
import { useFetch } from '../../hooks/useFetch'
import TablaMaterial from '../../components/TablaMaterial/TablaMaterial'

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
    sorting,
    setSorting
  } = useFetch('http://localhost:8000/api/personas', 'get')
  // const [sorting, setSorting] = useState([])
  const columns = useMemo(
    () => [
      { accessorKey: 'IdPersona', header: 'ID Persona' },
      { accessorKey: 'CUIT', header: 'CUIT' },
      { accessorKey: 'Apellido', header: 'Apellido' },
      { accessorKey: 'Nombre', header: 'Nombre' },
      { accessorKey: 'Nacionalidad', header: 'Nacionalidad' },
      { accessorKey: 'Actividad', header: 'Actividad' },
      { accessorKey: 'Domicilio', header: 'Domicilio' },
      { accessorKey: 'Email', header: 'Email' },
      { accessorKey: 'Telefono', header: 'Teléfono' },
      { accessorKey: 'Movil', header: 'Móvil' },
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
        size: '220',
        enableGlobalFilter: false,
        Cell: ({ row, table }) => (
          <ButtonGroup
            style={{ display: 'flex', justifyContent: 'flex-end' }}
            className='pe-5'
          >
            <Button estilo='primary' onClick={() => console.log(row)}>
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
        title='Personas'
        items={[{ name: 'Personas', link: '/personas' }]}
      />
      <SectionPage header={'Listado de personas registradas'}>
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

export default PersonasPage
