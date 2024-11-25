import { useMemo, useState } from 'react'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import SectionPage from '../../components/SectionPage/SectionPage'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { ButtonGroup, Modal } from 'react-bootstrap'
import Button from '../../components/Button/Button'
import { useFetch } from '../../hooks/useFetch'
import TablaMaterial from '../../components/TablaMaterial/TablaMaterial'
import ModalModificado from '../../components/Modal/ModalModificado'
import InputPersonas from '../../components/Formularios/FormPersonas/InputPersonas'
import { useForm } from 'react-hook-form'
import { API_URL } from '../../Fixes/API_URL.JS'

function PersonasPage () {
  const [ModalVerPersona, setModalVerPersona] = useState(false)
  const { control, errors, reset } = useForm()
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
  } = useFetch(`${API_URL}/api/personas`, 'get')
  // const [sorting, setSorting] = useState([])

  function handleVer (e) {
    reset(e.original)
    setModalVerPersona(e.original)
  }
  function closeModalVerPersona () {
    reset()
    setModalVerPersona(false)
  }

  const columns = useMemo(
    () => [
      { accessorKey: 'IdPersona', header: 'ID Persona' },
      { accessorKey: 'CUIT', header: 'CUIT' },
      { accessorKey: 'Apellido', header: 'Apellido' },
      { accessorKey: 'Nombre', header: 'Nombre' },
      // { accessorKey: 'Nacionalidad', header: 'Nacionalidad' },
      // { accessorKey: 'Actividad', header: 'Actividad' },
      // { accessorKey: 'Domicilio', header: 'Domicilio' },
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
            <Button estilo='primary' onClick={() => handleVer(row, table)}>
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
      <ModalModificado
        show={ModalVerPersona}
        handleClose={closeModalVerPersona}
        size={80}
        title={`Detalle de ${ModalVerPersona.Apellido}, ${ModalVerPersona.Nombre}`}
      >
        <Modal.Body>
          <InputPersonas control={control} errors={errors} />
        </Modal.Body>
        <Modal.Footer>
          <Button estilo='secondary' onClick={closeModalVerPersona}>Cerrar</Button>
        </Modal.Footer>
      </ModalModificado>
    </>
  )
}

export default PersonasPage
