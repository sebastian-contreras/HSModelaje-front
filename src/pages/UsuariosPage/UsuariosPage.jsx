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
import {
  activarUsuarioApi,
  darBajaUsuarioApi,
  deleteUsuarioApi
} from '../../services/UserService'

function UsuariosPage () {
  const [Modal, setModal] = useState(false)
  const [pIncluyeBajascheck, setpIncluyeBajascheck] = useState('N')
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
    handleFilterParams,
    setColumnFilters,
    sorting,
    setSorting
  } = useFetch(`${API_URL}/api/usuarios`, 'get', {
    pIncluyeBajas: pIncluyeBajascheck
  })

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
            if (refresh) {
              refresh()
              setpIncluyeBajascheck('N')
            }
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

  function darBaja (item) {
    Swal.fire({
      title: `¿Estas seguro de dar de baja el usuario ${item.Username}?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then(result => {
      if (result.isConfirmed) {
        darBajaUsuarioApi(item.IdUsuario)
          .then(response => {
            Alerta()
              .withMini(false)
              .withTipo('success')
              .withTitulo('Se dio de baja correctamente')
              .build()
            if (refresh) {
              refresh()
              setpIncluyeBajascheck('N')
            }
            if (close) close()
          })
          .catch(err => {
            Alerta()
              .withMini(false)
              .withTipo('error')
              .withTitulo('No se pudo dar de baja el usuario.')
              .withMensaje(
                err?.response?.data?.message
                  ? err.response.data.message
                  : MENSAJE_DEFAULT
              )
              .build()
          })
      }
    })
  }

  function activar (item) {
    Swal.fire({
      title: `¿Estas seguro de activar el usuario ${item.Username}?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then(result => {
      if (result.isConfirmed) {
        activarUsuarioApi(item.IdUsuario)
          .then(response => {
            Alerta()
              .withMini(false)
              .withTipo('success')
              .withTitulo('Se activo el usuario correctamente')
              .build()
            if (refresh) {
              refresh()
              setpIncluyeBajascheck('N')
            }
            if (close) close()
          })
          .catch(err => {
            Alerta()
              .withMini(false)
              .withTipo('error')
              .withTitulo('No se pudo activar el usuario.')
              .withMensaje(
                err?.response?.data?.message
                  ? err.response.data.message
                  : MENSAJE_DEFAULT
              )
              .build()
          })
      }
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
        size: '300',
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
                  titulo: `Usuario ${row.original.Username}`
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
                  titulo: `Modificar a ${row.original.Username}`
                })
              }
            >
              Modificar
            </Button>

            <Button estilo='danger' onClick={() => deleteItem(row.original)}>
              Borrar
            </Button>
            {row.original.EstadoUsuario == 'A' ? (
              <Button
                estilo='warning'
                onClick={() => darBaja(row.original)}
                disabled={row.original.EstadoUsuario == 'B'}
              >
                Dar Baja
              </Button>
            ) : (
              ''
            )}
            {row.original.EstadoUsuario == 'B' ? (
              <Button
                estilo='success'
                onClick={() => activar(row.original)}
                disabled={row.original.EstadoUsuario == 'A'}
              >
                Activar
              </Button>
            ) : (
              ''
            )}
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

          <div className='form-check form-check-reverse mb-0 pb-0 mt-3 fs-5'>
            <label className='form-check-label fw-bold fs-5'>
              ¿Incluye bajas?
            </label>
            <input
              type='checkbox'
              className='form-check-input'
              checked={pIncluyeBajascheck == 'S'} // El checkbox está marcado si el estado es "S"
              onChange={event => {
                setpIncluyeBajascheck(event.target.checked ? 'S' : 'N')
                handleFilterParams({
                  pIncluyeBajas: event.target.checked ? 'S' : 'N'
                })
              }} // Llama a handleChange cuando cambia
            />
          </div>

          <TablaMaterial
            columnFilters={columnFilters}
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
