import { useMemo, useState } from "react";
import { ButtonGroup, Dropdown, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Button from "../../components/Button/Button";
import FormUsers from "../../components/Formularios/FormUsers/FormUsers";
import GenerateInputs from "../../components/GenerateInputs/GenerateInputs";
import HeaderPageComponent from "../../components/HeaderPageComponent/HeaderPageComponent";
import ModalModificado from "../../components/Modal/ModalModificado";
import SectionPage from "../../components/SectionPage/SectionPage";
import TablaMaterial from "../../components/TablaMaterial/TablaMaterial";
import { API_URL } from "../../Fixes/API_URL";
import {
  ActivoBajaOptions,
  getLabelByValue,
  ROLES_CHOICES,
} from "../../Fixes/fixes";
import { formatearFecha, formatearFechayHora } from "../../Fixes/formatter";
import { MENSAJE_DEFAULT } from "../../Fixes/messages";
import { Alerta } from "../../functions/alerts";
import { useFetch } from "../../hooks/useFetch";
import {
  activarUsuarioApi,
  darBajaUsuarioApi,
  deleteUsuarioApi,
} from "../../services/UserService";

function UsuariosPage() {
  const { control, errors, reset, handleSubmit } = useForm();
  const inputsTest = [
    {
      name: `pApellidos`,
      control: control,
      label: "Apellido",
      type: "text",
      error: errors?.pApellidos,
      readOnly: false,
    },

    {
      name: `pNombres`,
      control: control,
      label: "Nombres",
      type: "text",
      error: errors?.pNombres,
      readOnly: false,
    },
    {
      name: `pRol`,
      control: control,
      label: "Rol",
      type: "select",
      error: errors?.pRol,
      options: ROLES_CHOICES,
      readOnly: false,
    },
  ];
  const [Modal, setModal] = useState(false);
  const [pIncluyeInactivoscheck, setpIncluyeInactivoscheck] = useState("N");
  const [Busqueda, setBusqueda] = useState("");
  const [Seleccionado, setSeleccionado] = useState(null);
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
    setSorting,
  } = useFetch(`${API_URL}/api/usuarios/busqueda`, "get", {
    pIncluyeInactivos: pIncluyeInactivoscheck,
    pCantidad: 10,
    pPagina: 1,
  });

  function closeForm() {
    setSeleccionado(null);
    setModal(false);
  }

  function openForm(
    e = null,
    { soloVer = false, modificar = false, titulo = "No hay titulo" }
  ) {
    console.log(e?.original);
    setSeleccionado(e?.original);
    setModal({ soloVer, modificar, titulo });
  }

  const deleteItem = (item) => {
    Swal.fire({
      title: `¿Estas seguro de eliminar el usuario ${item.Username}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
    })
      .then((result) => {
        if (result.isConfirmed) {
          deleteUsuarioApi(item.IdUsuario).then((response) => {
            Alerta()
              .withMini(true)
              .withTipo("success")
              .withTitulo("Se elimino el usuario correctamente")
              .withMensaje(response.message)
              .build();
            if (refresh) {
              refresh();
              setpIncluyeInactivoscheck("N");
            }
          });
        }
      })
      .catch((err) => {
        Alerta()
          .withMini(true)
          .withTipo("error")
          .withTitulo("No se elimino el usuario.")
          .withMensaje(
            err?.response?.data?.message
              ? err.response.data.message
              : MENSAJE_DEFAULT
          )
          .build();
      });
  };

  function darBaja(item) {
    Swal.fire({
      title: `¿Estas seguro de dar de baja el usuario ${item.Username}?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
    }).then((result) => {
      if (result.isConfirmed) {
        darBajaUsuarioApi(item.IdUsuario)
          .then((response) => {
            Alerta()
              .withMini(false)
              .withTipo("success")
              .withTitulo("Se dio de baja correctamente")
              .build();
            if (refresh) {
              refresh();
              setpIncluyeInactivoscheck("N");
            }
            if (close) close();
          })
          .catch((err) => {
            Alerta()
              .withMini(false)
              .withTipo("error")
              .withTitulo("No se pudo dar de baja el usuario.")
              .withMensaje(
                err?.response?.data?.message
                  ? err.response.data.message
                  : MENSAJE_DEFAULT
              )
              .build();
          });
      }
    });
  }

  function activar(item) {
    Swal.fire({
      title: `¿Estas seguro de activar el usuario ${item.Username}?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
    }).then((result) => {
      if (result.isConfirmed) {
        activarUsuarioApi(item.IdUsuario)
          .then((response) => {
            Alerta()
              .withMini(false)
              .withTipo("success")
              .withTitulo("Se activo el usuario correctamente")
              .build();
            if (refresh) {
              refresh();
              setpIncluyeInactivoscheck("N");
            }
            if (close) close();
          })
          .catch((err) => {
            Alerta()
              .withMini(false)
              .withTipo("error")
              .withTitulo("No se pudo activar el usuario.")
              .withMensaje(
                err?.response?.data?.message
                  ? err.response.data.message
                  : MENSAJE_DEFAULT
              )
              .build();
          });
      }
    });
  }

  const columns = useMemo(
    () => [
      { accessorKey: "IdUsuario", header: "#" },
      { accessorKey: "Username", header: "Usuario" },
      { accessorKey: "Apellidos", header: "Apellidos" },
      { accessorKey: "Nombres", header: "Nombres" },
      {
        accessorKey: "FechaNacimiento",
        header: "FechaNacimiento",
        Cell: ({ cell }) => formatearFecha(cell.getValue()),
      },
      { accessorKey: "Telefono", header: "Telefono" },
      { accessorKey: "Email", header: "Email" },
      {
        accessorKey: "FechaCreado",
        header: "FechaCreado",
        Cell: ({ cell }) => formatearFechayHora(cell.getValue()),
      },
      {
        accessorKey: "EstadoUsuario",
        header: "EstadoUsuario",
        Cell: ({ cell }) => getLabelByValue(ActivoBajaOptions, cell.getValue()),
      },
      {
        accessorKey: "Rol",
        header: "Rol",
        Cell: ({ cell }) => getLabelByValue(ROLES_CHOICES, cell.getValue()),
      },
      {
        accessorKey: "acciones",
        header: "Acciones",
        enableSorting: false,
        enableHiding: false,
        size: "300",
        enableGlobalFilter: false,
        Cell: ({ row, table }) => (
          <ButtonGroup style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              estilo="primary"
              onClick={() =>
                openForm(row, {
                  soloVer: true,
                  titulo: `Usuario ${row.original.Username}`,
                })
              }
            >
              Ver
            </Button>
            <Button
              estilo="secondary"
              onClick={() =>
                openForm(row, {
                  modificar: true,
                  titulo: `Modificar a ${row.original.Username}`,
                })
              }
            >
              Modificar
            </Button>

            <Button estilo="danger" onClick={() => deleteItem(row.original)}>
              Borrar
            </Button>
            {row.original.EstadoUsuario == "A" ? (
              <Button
                estilo="warning"
                onClick={() => darBaja(row.original)}
                disabled={row.original.EstadoUsuario == "B"}
              >
                Dar Baja
              </Button>
            ) : (
              ""
            )}
            {row.original.EstadoUsuario == "B" ? (
              <Button
                estilo="success"
                onClick={() => activar(row.original)}
                disabled={row.original.EstadoUsuario == "A"}
              >
                Activar
              </Button>
            ) : (
              ""
            )}
          </ButtonGroup>
        ),
      },
    ],
    []
  );

  const onSubmit = (data) => {
    console.log(data);
    handleFilterParams({ ...data, pCantidad: 10, pPagina: 1, pIncluyeInactivos: pIncluyeInactivoscheck });
    // Aquí puedes manejar los datos del formulario
  };

  function fastSearch(e) {
    setBusqueda(e.target.value);
    handleFilterParams({ pCadena: e.target.value });
  }

  return (
    <>
      <div>
        <HeaderPageComponent
          title="Usuarios"
          items={[{ name: "Usuarios", link: "/usuarios" }]}
        />
        <SectionPage header={"Listado de usuarios registrados"}>
          <div className="d-flex justify-content-start">
            <Button
              lg
              onClick={() =>
                openForm(null, {
                  soloVer: false,
                  modificar: false,
                  titulo: "Registrar Usuario",
                })
              }
            >
              Registrar Usuarios
            </Button>
          </div>

          <div className="form-check form-check-reverse fs-5">
            <label className="form-check-label fw-bold fs-5">
              ¿Incluye bajas?
            </label>
            <input
              type="checkbox"
              className="form-check-input"
              checked={pIncluyeInactivoscheck == "S"} // El checkbox está marcado si el estado es "S"
              onChange={(event) => {
                setpIncluyeInactivoscheck(event.target.checked ? "S" : "N");
                handleFilterParams({
                  pIncluyeInactivos: event.target.checked ? "S" : "N",
                });
              }} // Llama a handleChange cuando cambia
            />
          </div>
          <div className="input-group mb-0 ">
            <Dropdown className="me-3" style={{ width: "20rem" }}>
              <Dropdown.Toggle
                variant="primary"
                className="w-100"
                id="dropdown-basic"
              >
                Filtros Avanzado
              </Dropdown.Toggle>

              <Dropdown.Menu className="w-100">
                <Form
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ padding: "10px" }}
                >
                  <GenerateInputs
                    inputs={inputsTest}
                    control={control}
                    errors={errors}
                    onlyView={false}
                  />
                  <Button estilo="primary" type="submit">
                    Enviar Filtros
                  </Button>
                </Form>
              </Dropdown.Menu>
            </Dropdown>
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              value={Busqueda}
              onChange={fastSearch}
              className="form-control"
              placeholder="Busqueda de eventos por nombre"
            />
          </div>

          {error ? (
            "Ocurrio un error, contacte con el administrador."
          ) : (
            <TablaMaterial
              columnFilters={columnFilters}
              loading={loading}
              pagination={pagination}
              setColumnFilters={setColumnFilters}
              setPagination={setPagination}
              setSorting={setSorting}
              rowCount={data?.total_row}
              sorting={sorting}
              columns={columns}
              data={data.data}
            />
          )}
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
  );
}

export default UsuariosPage;
