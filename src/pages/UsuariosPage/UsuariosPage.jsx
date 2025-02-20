import { useMemo, useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { API_URL } from '../../Fixes/API_URL'
import Swal from 'sweetalert2'
import { Alerta } from '../../functions/alerts'
import { MENSAJE_DEFAULT } from '../../Fixes/messages'
import { formatearFechayHora } from '../../Fixes/formatter'
import { ButtonGroup } from 'react-bootstrap'
import Button from '../../components/Button/Button'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import SectionPage from '../../components/SectionPage/SectionPage'
import TablaMaterial from '../../components/TablaMaterial/TablaMaterial'
import ModalModificado from '../../components/Modal/ModalModificado'
import FormUsers from '../../components/Formularios/FormUsers/FormUsers'
import { getLabelByValue, ROLES_CHOICES } from '../../Fixes/fixes'
import { deleteUsuarioApi } from '../../services/UserService'

function UsuariosPage () {
  const [Modal, setModal] = useState(false)
  const [Seleccionado, setSeleccionado] = useState(null)
  const {
    data,
    loading,
    error,
    params,
    response,
    body,
    handlePagination,
    pagination,
    setPagination,
    columnFilters,
    refresh,
    setColumnFilters,
    sorting,
    setSorting
  } = useFetch(`${API_URL}/api/usuarios`, 'get')
  console.log(data)
  function closeForm () {
    setSeleccionado(null)
    setModal(false)
  }

  function openForm (
    e = null,
    { soloVer = false, modificar = false, titulo = 'No hay titulo' }
  ) {
    console.log(e?.original)
    setSeleccionado(e?.original)
    setModal({ soloVer, modificar, titulo })
  }

  const deleteItem = item => {
    Swal.fire({
      title: `¿Estas seguro de eliminar el usuario ${item.Username}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    })
      .then(result => {
        if (result.isConfirmed) {
          deleteUsuarioApi(item.IdUsuario).then(response => {
            Alerta()
              .withMini(true)
              .withTipo('success')
              .withTitulo('Se elimino el usuario correctamente')
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
          .withTitulo('No se elimino el usuario.')
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
      { accessorKey: 'IdUsuario', header: '#' },
      { accessorKey: 'Username', header: 'Usuario' },
      { accessorKey: 'Apellidos', header: 'Apellidos' },
      { accessorKey: 'Nombres', header: 'Nombres' },
      { accessorKey: 'FechaNacimiento', header: 'FechaNacimiento' },
      { accessorKey: 'Telefono', header: 'Telefono' },
      { accessorKey: 'Email', header: 'Email' },
      { accessorKey: 'FechaCreado', header: 'FechaCreado' },
      { accessorKey: 'EstadoUsuario', header: 'EstadoUsuario' },
      {
        accessorKey: 'Rol',
        header: 'Rol',
        Cell: ({ cell }) => getLabelByValue(ROLES_CHOICES, cell.getValue())
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
              onClick={() =>
                openForm(row, {
                  soloVer: true,
                  titulo: `Usuario ${row.original.name}`
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
                  titulo: `Modificar a ${row.original.name}`
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
          title='Usuarios'
          items={[{ name: 'Usuarios', link: '/usuarios' }]}
        />
        <SectionPage header={'Listado de usuarios registradas'}>
          <div className='d-flex justify-content-start'>
            <Button
              lg
              onClick={() =>
                openForm(null, {
                  soloVer: false,
                  modificar: false,
                  titulo: 'Registrar Usuario'
                })
              }
            >
              Registrar Usuarios
            </Button>
          </div>
          <TablaMaterial
            loading={loading}
            pagination={pagination}
            columns={columns}
            data={data}
          />
        </SectionPage>
      </div>
      <ModalModificado
        show={Modal}
        handleClose={closeForm}
        size={40}
        title={Modal.titulo}
        // title={`Detalle de ${CajaSeleccionada?.NumeroCaja ||''}, Fila: ${CajaSeleccionada?.Fila ||''}, Columna: ${CajaSeleccionada?.Columna ||''}`}
      >
        <FormUsers
          closeModal={closeForm}
          onlyView={Modal.soloVer}
          modificar={Modal.modificar}
          dataform={Seleccionado}
          refresh={refresh}
        />
      </ModalModificado>
    </>
  )
}

export default UsuariosPage
