import React from "react";
import ReactDOM from "react-dom";
import {BotonRegistro,BotonLogin} from "./Botones"
import {PaginalInicial} from "./paginaInicio";

class MenuDePagina extends React.Component {
    render() {
        this.LoggedIn();
        return (
         <div>
             <h1>Twitter</h1>
             <h4>Made by Jesus M.</h4>
             <BotonRegistro/>
             <BotonLogin/>
         </div>
        )
    }
    LoggedIn(){
        fetch("http://localhost:5000/loginSingUp/LoggedIn",{
            method:"GET",
            credentials:"include"
        }).then(response => response.text())
            .then(response => {
                if(response === "True"){
                    ReactDOM.render(<PaginalInicial/>, document.getElementById("root"));
                }
            })
    }
}

export default MenuDePagina;