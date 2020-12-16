import React from "react";
import ReactDOM from "react-dom";
import {Registro,Login} from "./ventanaInicio";

class BotonRegistro extends React.Component {
    render() {
        return(
            <button onClick={this.cambioPagina1} style={{margin: "15px"}}>Registro</button>
        )
    }
    cambioPagina1 = () => {
        ReactDOM.render(<Registro/>, document.getElementById("Div-1"));
    }
}

class BotonLogin extends React.Component {
    render() {
        return(
            <button onClick={this.cambioPagina2} style={{margin: "15px"}}>Login</button>
        )
    }
    cambioPagina2 = () => {
        ReactDOM.render(<Login/>, document.getElementById("Div-1"));
    }
}

export {BotonRegistro, BotonLogin}
