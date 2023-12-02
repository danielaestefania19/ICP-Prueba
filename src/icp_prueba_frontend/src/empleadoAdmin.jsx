import * as React from "react";
import { createRoot } from 'react-dom/client';
import {
    icp_prueba_backend as canister,
    createActor,
} from "../../declarations/icp_prueba_backend";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
let actor = canister;
import { Input, Button } from "@chakra-ui/react";
import styles from "../assets/app.module.css";

const EmpleadoAdmin = () => {
    const [empleadoSearch, setEmpleadoSearch] = React.useState(null);
    const [empleadoSearchWithId, setEmpleadoSearchWithId] = React.useState(null);
    const [whoami, setWhoami] = React.useState(null);
  
    const buscarEmpleado = () => {
      const inputIds = ["idEmpleado"];
      const inputs = inputIds.map((id) => document.getElementById(id));
      const [idEmpleado] = inputs.map((input) => input.value);
      console.log(idEmpleado);
  
      if (idEmpleado === "") {
        alert("Ingrese un id");
        return;
      }
  
      canister
        .obtenerEmpleado(idEmpleado)
        .then((result) => {
          console.log(result);
          setEmpleadoSearch(result);
        })
        .catch((err) => {
          console.log(err);
          alert("Error en la busqueda del empleado");
        });
    };
  
    const crearEmpleado = () => {
      const inputIds = [
        "crearEmpleado_id",
        "crearEmpleado_nombre",
        "crearEmpleado_apellidoPaterno",
        "crearEmpleado_apellidoMaterno",
        "crearEmpleado_nacimientoFecha",
      ];
      const inputs = inputIds.map((id) => document.getElementById(id));
      const [
        idEmpleado,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        nacimientoFecha,
      ] = inputs.map((input) => input.value);
      console.log(
        idEmpleado,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        nacimientoFecha
      );
      if (inputs.some((input) => input.value === "")) {
        alert("Debe llenar todos los campos");
        return;
      }
  
      const nacimientoFechaDate = new Date(nacimientoFecha);
      const diaNacimientoInt = nacimientoFechaDate.getDate() + 1;
      const mesNacimientoInt = nacimientoFechaDate.getMonth() + 1;
      const anioNacimientoInt = nacimientoFechaDate.getFullYear();
      console.log(diaNacimientoInt, mesNacimientoInt, anioNacimientoInt);
  
      const fechaActual = new Date();
      const diaActual = fechaActual.getDate() + 1;
      const mesActual = fechaActual.getMonth() + 1;
      const anioActual = fechaActual.getFullYear();
      console.log(diaActual, mesActual, anioActual);
  
      if (anioNacimientoInt > anioActual) {
        alert("Año de nacimiento no valido");
        return;
      }
      if (anioNacimientoInt === anioActual && mesNacimientoInt > mesActual) {
        alert("Mes de nacimiento no valido");
        return;
      }
  
      if (
        anioNacimientoInt === anioActual &&
        mesNacimientoInt === mesActual &&
        diaNacimientoInt > diaActual
      ) {
        alert("Dia de nacimiento no valido");
        return;
      }
  
      canister
        .nuevoEmpleado(idEmpleado, {
          anioNacimiento: anioNacimientoInt,
          apellidoMaterno: apellidoMaterno,
          apellidoPaterno: apellidoPaterno,
          diaNacimiento: diaNacimientoInt,
          mesNacimiento: mesNacimientoInt,
          nombre: nombre,
        })
        .then((result) => {
          alert("Empleado creado");
        })
        .catch((err) => {
          console.log(err);
          alert("Error en la creacion del empleado");
        });
    };
  
    const borrarEmpleado = () => {
      const inputIds = ["borrarEmpleado_id"];
      const inputs = inputIds.map((id) => document.getElementById(id));
      const [idEmpleado] = inputs.map((input) => input.value);
      console.log(idEmpleado);
      if (idEmpleado === "") {
        alert("Debe ingresar un id de empleado");
        return;
      }
      // confirmacion de borrar empleado
      const confirmacion = confirm("¿Esta seguro de borrar el empleado?");
      if (!confirmacion) {
        return;
      }
  
      canister
        .eliminarEmpleado(idEmpleado)
        .then(() => {
          alert("Empleado borrado");
        })
        .catch((err) => {
          console.log(err);
          alert("Error en el borrado del empleado");
        });
    };
  
    const local_ii_url = `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;
    const callInternetIdentity = async () => {
      let iiUrl;
      if (process.env.DFX_NETWORK === "local") {
        iiUrl = local_ii_url;
      } else if (process.env.DFX_NETWORK === "ic") {
        //llama a
        iiUrl = `https://identity.ic0.app`;
      } else {
        iiUrl = local_ii_url;
      }
      const authClient = await AuthClient.create();
  
      await new Promise((resolve) => {
        authClient.login({
          identityProvider: iiUrl,
          onSuccess: resolve,
          onError: () => {
            alert("Login error");
          },
        });
      });
  
      const identity = await authClient.getIdentity();
      const agent = new HttpAgent({ identity });
  
      actor = createActor(process.env.CANISTER_ID_ICP_PRUEBA_BACKEND, {
          agent,
      });
  
      const principal = await actor.whoami();
      console.log(principal.toString());
      setWhoami(principal.toString());
    };
  
    return (
      <div>
          <div className={styles.main}>
          <div className={styles.busqueda}>
            <h1>Buscar empleado</h1>
            {empleadoSearch && empleadoSearch.nombre ? (
              <div>
                <p>
                  Nombre:{" "}
                  {`${empleadoSearch.nombre} ${empleadoSearch.apellidoPaterno} ${empleadoSearch.apellidoMaterno}`}
                </p>
                <p>
                  Fecha de nacimiento:{" "}
                  {`${empleadoSearch.diaNacimiento}/${empleadoSearch.mesNacimiento}/${empleadoSearch.anioNacimiento}`}
                </p>
                <Button size="sm" onClick={() => setEmpleadoSearch(null)}>
                  Limpiar
                </Button>
              </div>
            ) : (
              <>
                <Input
                  size="sm"
                  id="idEmpleado"
                  type="text"
                  placeholder="Ingrese id de empleado"
                />
                <Button size="sm" onClick={buscarEmpleado}>
                  Buscar Empleado
                </Button>
              </>
            )}
          </div>
          <div className={styles.crear}>
            <h1>Crear empleado</h1>
            <Input
              size="sm"
              id="crearEmpleado_id"
              type="text"
              placeholder="Ingrese id de empleado"
            />
            <Input
              size="sm"
              id="crearEmpleado_nombre"
              type="text"
              placeholder="Ingrese nombre"
            />
            <Input
              size="sm"
              id="crearEmpleado_apellidoPaterno"
              type="text"
              placeholder="Ingrese apellido paterno"
            />
            <Input
              size="sm"
              id="crearEmpleado_apellidoMaterno"
              type="text"
              placeholder="Ingrese apellido materno"
            />
            <Input
              size="sm"
              id="crearEmpleado_nacimientoFecha"
              type="date"
              placeholder="Ingrese fecha de nacimiento"
            />
            <Button size="sm" onClick={crearEmpleado}>
              Crear Empleado
            </Button>
          </div>
          <div className={styles.borar}>
            <h1>Borrar empleado</h1>
            <div>
              <Input
                size="sm"
                id="borrarEmpleado_id"
                type="text"
                placeholder="Ingrese id de empleado"
              />
              <Button size="sm" onClick={borrarEmpleado}>
                Borrar Empleado
              </Button>
            </div>
          </div>
          <Button size="sm" onClick={callInternetIdentity}>
                  LogIn with Internet Identity ∞
          </Button>
          <div>
            <p>Principal: {whoami}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default EmpleadoAdmin;