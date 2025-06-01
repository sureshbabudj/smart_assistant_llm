import { useState } from "react";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { ChatWrapper } from "./components/ChatWrapper";

function App() {
  const [registerScreen, setRegisterScreen] = useState(false);

  // read jwt from local storage
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    if (!registerScreen) {
      return <Login loadRegister={() => setRegisterScreen(true)} />;
    } else {
      return <Register loadLogin={() => setRegisterScreen(false)} />;
    }
  }

  return <ChatWrapper />;
}

export default App;
