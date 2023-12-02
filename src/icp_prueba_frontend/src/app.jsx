import * as React from "react";
import { Button } from "@chakra-ui/react";
import EmpleadoAdmin from "./empleadoAdmin.jsx";

const App = () => {
  const [empleadoSearch, setEmpleadoSearch] = React.useState(0);

  return (
    <>
      {empleadoSearch === 1 ? (
        <EmpleadoAdmin />
      ) : (
        <>
        <h1>Entrar</h1>
        <Button colorScheme='red' onClick={() => setEmpleadoSearch(1)}>Admin</Button>
        </>
      )}
    </>
  );
};

export default App;