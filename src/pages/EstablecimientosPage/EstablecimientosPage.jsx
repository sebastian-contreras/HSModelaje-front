import { useMemo, useState } from 'react'
import { ButtonGroup } from 'react-bootstrap'
import Swal from 'sweetalert2'
import Button from '../../components/Button/Button'
import FormEstablecimientos from '../../components/Formularios/FormEstablecimientos/FormEstablecimientos'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import ModalModificado from '../../components/Modal/ModalModificado'
import SectionPage from '../../components/SectionPage/SectionPage'
import TablaMaterial from '../../components/TablaMaterial/TablaMaterial'
import { API_URL } from '../../Fixes/API_URL'
import { MENSAJE_DEFAULT } from '../../Fixes/messages'
import { Alerta } from '../../functions/alerts'
import { useFetch } from '../../hooks/useFetch'
import {
  activarEstablecimientoApi,
  darBajaEstablecimientoApi,
  deleteEstablecimientoApi
} from '../../services/EstablecimientosService'

function EstablecimientosPage () {
  const [Modal, setModal] = useState(false)
  const [Seleccionado, setSeleccionado] = useState(null)
  const [pIncluyeBajascheck, setpIncluyeBajascheck] = useState('N')

  const {
    data,
    loading,
    error,
    params,
    response,
    body,
    handlePagination,
    pagination,
    handleFilterParams,
    setPagination,
    columnFilters,
    refresh,
    setColumnFilters,
    sorting,
    setSorting
  } = useFetch(`${API_URL}/api/establecimientos`, 'get', {
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

  function darBaja (item) {
    Swal.fire({
      title: `¿Estas seguro de dar de baja el usuario ${item.Establecimiento}?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then(result => {
      if (result.isConfirmed) {
        darBajaEstablecimientoApi(item.IdEstablecimiento)
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
      title: `¿Estas seguro de activar el usuario ${item.Establecimiento}?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then(result => {
      if (result.isConfirmed) {
        activarEstablecimientoApi(item.IdEstablecimiento)
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

  const deleteItem = item => {
    Swal.fire({
      title: `¿Estas seguro de eliminar el establecimiento ${item.Establecimiento}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    })
      .then(result => {
        if (result.isConfirmed) {
          deleteEstablecimientoApi(item.IdEstablecimiento).then(response => {
            Alerta()
              .withMini(true)
              .withTipo('success')
              .withTitulo('Se elimino el establecimiento correctamente')
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
          .withTitulo('No se elimino el establecimiento.')
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
      { accessorKey: 'IdEstablecimiento', header: '#' },
      { accessorKey: 'Establecimiento', header: 'Establecimiento' },
      { accessorKey: 'Ubicacion', header: 'Ubicacion' },
      { accessorKey: 'Capacidad', header: 'Capacidad' },
      { accessorKey: 'EstadoEstablecimiento', header: 'Estado' },
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
                  titulo: `Establecimiento ${row.original.Establecimiento}`
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
                  titulo: `Modificar a ${row.original.Establecimiento}`
                })
              }
            >
              Modificar
            </Button>

            <Button estilo='danger' onClick={() => deleteItem(row.original)}>
              Borrar
            </Button>
            {row.original.EstadoEstablecimiento == 'A' ? (
              <Button
                estilo='warning'
                onClick={() => darBaja(row.original)}
                disabled={row.original.EstadoEstablecimiento == 'B'}
              >
                Dar Baja
              </Button>
            ) : (
              ''
            )}
            {row.original.EstadoEstablecimiento == 'B' ? (
              <Button
                estilo='success'
                onClick={() => activar(row.original)}
                disabled={row.original.EstadoEstablecimiento == 'A'}
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
          title='Eventos'
          items={[{ name: 'establecimientos', link: '/establecimientos' }]}
        />
        <SectionPage header={'Listado de establecimientos registradas'}>
          <div className='d-flex justify-content-start'>
            <Button
              lg
              onClick={() =>
                openForm(null, {
                  soloVer: false,
                  modificar: false,
                  titulo: 'Registrar evento'
                })
              }
            >
              Registrar establecimientos
            </Button>
          </div>

          <div className='form-check form-check-reverse mb-0 pb-0 mt-3 fs-5'>
          <label className='form-check-label fw-bold fs-5'>¿Incluye bajas?</label>
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
      >
        <FormEstablecimientos
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

export default EstablecimientosPage
