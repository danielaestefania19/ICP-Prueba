import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./app.jsx";
import { ChakraProvider } from "@chakra-ui/react";

const Index = () => {
  return (
    <React.StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </React.StrictMode>
  );
};

const root = createRoot(document.getElementById("app"));
root.render(<Index />);
