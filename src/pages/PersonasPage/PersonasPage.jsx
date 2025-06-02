import { useEffect, useMemo, useState } from 'react'
import { ButtonGroup } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { formatearFechayHora } from '../../Fixes/formatter'
import Button from '../../components/Button/Button'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import SectionPage from '../../components/SectionPage/SectionPage'
import TablaMaterial from '../../components/TablaMaterial/TablaMaterial'
import { Alerta } from '../../functions/alerts'

function PersonasPage () {
  const [ModalVerPersona, setModalVerPersona] = useState(false)
  const [Modal, setModal] = useState(false)
  const [Seleccionado, setSeleccionado] = useState(null)
  const { control, errors, reset } = useForm()
  const [Data, setData] = useState([])
  useEffect(() => {
    listarUsuarioApi(res => {
      console.log(res)
      setData(res.data)
    })
  }, [])

  function openForm (
    e = null,
    { soloVer = false, modificar = false, titulo = 'No hay titulo' }
  ) {
    reset(e?.original)
    setSeleccionado(e?.original)
    setModal({ soloVer, modificar, titulo })
  }

  const deleteItem = item => {
    Swal.fire({
      title: `¿Estas seguro de eliminar la persona ${item.CUIT} - ${item.Apellido}, ${item.Nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    })
      .then(result => {
        if (result.isConfirmed) {
          deletePersonasApi(item.IdPersona).then(response => {
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
      .catch(err => {
        Alerta()
          .withMini(true)
          .withTipo('error')
          .withTitulo('No se elimino la caja.')
          .withMensaje(
            err?.response?.data?.message
              ? err.response.data.message
              : MENSAJE_DEFAULT
          )
          .build()
      })
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
      {
        accessorKey: 'EstadoPersona',
        header: 'Estado',
        filterVariant: 'select'
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
    <>
      <div>
        <HeaderPageComponent
          title='Personas'
          items={[{ name: 'Personas', link: '/personas' }]}
        />
        <SectionPage header={'Listado de personas registradas'}>
          <div className='d-flex justify-content-start'>
            <Button
              lg
              onClick={() =>
                openForm(null, {
                  soloVer: false,
                  modificar: false,
                  titulo: 'Registrar Persona'
                })
              }
            >
              Crear Persona
            </Button>
          </div>
          <TablaMaterial
            // columnFilters={columnFilters}
            // loading={loading}
            // pagination={pagination}
            // setPagination={setPagination}
            // setSorting={setSorting}
            // sorting={sorting}
            columns={columns}
            data={Data}
          />
        </SectionPage>
      </div>
      {/* <ModalModificado
        show={Modal}
        handleClose={closeForm}
        size={80}
        title={Modal.titulo}
        // title={`Detalle de ${CajaSeleccionada?.NumeroCaja ||''}, Fila: ${CajaSeleccionada?.Fila ||''}, Columna: ${CajaSeleccionada?.Columna ||''}`}
      >
        <FormPersona
          closeModal={closeForm}
          soloVer={Modal.soloVer}
          modificar={Modal.modificar}
          dataform={Seleccionado}
          refresh={refresh}
        />
      </ModalModificado> */}
    </>
  )
}

export default PersonasPage
