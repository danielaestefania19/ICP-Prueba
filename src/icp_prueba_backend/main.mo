import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Nat32 "mo:base/Nat32";
import Nat8 "mo:base/Nat8";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";
import Nat16 "mo:base/Nat16";

actor {

  type metadatosEmpleado = {
    nombre : Text;
    apellidoMaterno : Text;
    apellidoPaterno : Text;
    diaNacimiento : Nat8;
    mesNacimiento : Nat8;
    anioNacimiento : Nat32;
  };

  type metadatosEmpleadoInput = {
    nombre : Text;
    apellidoMaterno : Text;
    apellidoPaterno : Text;
    diaNacimiento : Nat;
    mesNacimiento : Nat;
    anioNacimiento : Nat;
  };
  
  let empleado = Map.HashMap<Text, metadatosEmpleado>(0, Text.equal, Text.hash);

  public func nuevoEmpleado(idEmpleado : Text, datos : metadatosEmpleadoInput) : async () {
    if (datos.nombre == "") {
      Debug.trap("Ingrese un nombre");
    };
    if (datos.apellidoMaterno == "") {
      Debug.trap("Ingrese un apellido materno");
    };
    if (datos.apellidoPaterno == "") {
      Debug.trap("Ingrese un apellido paterno");
    };
    if (datos.diaNacimiento == 0 or datos.diaNacimiento > 31 or datos.mesNacimiento == 0 or datos.mesNacimiento > 12 or datos.anioNacimiento == 0) {
      Debug.trap("Ingrese una fecha de nacimiento valida");
    };
    
    empleado.put(idEmpleado, 
      {
        nombre = datos.nombre;
        apellidoMaterno = datos.apellidoMaterno;
        apellidoPaterno = datos.apellidoPaterno;
        diaNacimiento  = Nat8.fromNat(datos.diaNacimiento);
        mesNacimiento : Nat8 = Nat8.fromNat(datos.mesNacimiento);
        anioNacimiento : Nat32 = Nat32.fromNat(datos.anioNacimiento);
      } 
    );

    Debug.print("Empleado agregado");
  };

  public query func obtenerEmpleado(idEmpleado : Text) : async metadatosEmpleado {
    let empleadoObtenido = empleado.get(idEmpleado);
    var aux = switch (empleadoObtenido) {
      case (null) {
        {
          nombre = "";
          apellidoMaterno = "";
          apellidoPaterno = "";
          diaNacimiento : Nat8 = 0;
          mesNacimiento : Nat8 = 0;
          anioNacimiento : Nat32 = 0;
        };
      };
      case (?empleadoObtenido) empleadoObtenido;
    };
    return {
      nombre = aux.nombre;
      apellidoMaterno = aux.apellidoMaterno;
      apellidoPaterno = aux.apellidoPaterno;
      diaNacimiento = aux.diaNacimiento;
      mesNacimiento = aux.mesNacimiento;
      anioNacimiento = aux.anioNacimiento;
    };
  };

  public func actualizarEmpleado(idEmpleado : Text, datos : metadatosEmpleado) : async () {
    if (datos.nombre == "") {
      Debug.trap("Ingrese un nombre");
    };
    if (datos.apellidoMaterno == "") {
      Debug.trap("Ingrese un apellido materno");
    };
    if (datos.apellidoPaterno == "") {
      Debug.trap("Ingrese un apellido paterno");
    };
    if (datos.diaNacimiento == 0 or datos.diaNacimiento > 31 or datos.mesNacimiento == 0 or datos.mesNacimiento > 12 or datos.anioNacimiento == 0) {
      Debug.trap("Ingrese una fecha de nacimiento valida");
    };

    if (empleado.replace(idEmpleado, datos) == null) {
      Debug.trap("Empleado no encontrado");
    };
  };

  public func eliminarEmpleado(idEmpleado : Text) : async () {
    if (empleado.remove(idEmpleado) == null) {
      Debug.trap("Empleado no encontrado");
    };
  };

  public shared (msg) func whoami() : async Principal {
    msg.caller;
  };

};
