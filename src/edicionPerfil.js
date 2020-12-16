import React from "react";
import ReactDOM from "react-dom";
import {Enrutar} from "./rutaComponentes"
import Menu from "./paginaPrincipal"

class EdicionPagina extends React.Component{
    render(){
        return(
            <div style={{textAlign:"left"}} >
                <br/><br/>
                <div style={{color:"Highlight"}}>
                    <h3>Edit your current data</h3>
                    <h5>Notes: <br/>* To edit your avatar click on it in your profile page</h5>
                    <h5>* Leave blank fields that shouldn't be edited</h5>
                    <h5>* To make any changes you must insert your current password</h5>
                </div>
                <br/>
                <p id={"mensaje"} style={{color:"red", fontWeight:"bold", fontSize:""}}></p>
                <br/>
                <form id={"newDataForm"}>
                    <label htmlFor={"username"} style={{fontWeight:"bold", fontSize:"small", color:"Yellow"}} >Username: </label>
                    <input name={"username"} onInput={this.verificarEntradaUsuario} style={{backgroundColor:"black", borderRadius:"10%", color:"yellow", borderColor:"gray"}} placeholder={"New username..."} type={"text"} />
                    <img id={"usernameCheck"} alt={""} style={{width:"20px"}} src={""}/>
                    <br/><br/>
                    <label htmlFor={"mail"} style={{fontWeight:"bold", fontSize:"small", color:"Yellow"}} >E-Mail: </label>
                    <input name={"mail"} onInput={this.verificarEntradaEmail} style={{backgroundColor:"black", borderRadius:"10%", color:"yellow", borderColor:"gray"}} placeholder={"New E-Mail..."} type={"mail"} />
                    <img id={"mailCheck"} alt={""} style={{width:"20px"}} src={""}/>
                    <br/><br/>
                    <label htmlFor={"currentPass"} style={{fontWeight:"bold", fontSize:"small", color:"Yellow"}} >Current password: </label>
                    <input onInput={this.verificarEntradaPass} name={"currentPass"} style={{backgroundColor:"black", borderRadius:"10%", color:"yellow", borderColor:"gray"}} placeholder={"Your current password..."} type={"password"} />
                    <img id={"currentPassCheck"} alt={""} style={{width:"20px"}} src={""}/>
                    <br/><br/>
                    <label htmlFor={"newPass"} style={{fontWeight:"bold", fontSize:"small", color:"Yellow"}} >New password: </label>
                    <input onInput={this.verificarNuevaEntradaPass} name={"newPass"} style={{backgroundColor:"black", borderRadius:"10%", color:"yellow", borderColor:"gray"}} placeholder={"Your new password..."} type={"password"} />
                    <img id={"newPassCheck"} alt={""} style={{width:"20px"}} src={""}/>
                    <br/><br/>
                    <label htmlFor={"confirmation"} style={{fontWeight:"bold", fontSize:"small", color:"Yellow"}} >Confirm new password: </label>
                    <input onInput={this.verificarNuevaEntradaPass} name={"confirmation"} style={{backgroundColor:"black", borderRadius:"10%", color:"yellow", borderColor:"gray"}} placeholder={"Your new password..."} type={"password"} />
                    <img id={"newPassCheck2"} alt={""} style={{width:"20px"}} src={""}/>
                </form>
                <br/>
                <input onClick={this.enviar} type={"image"} style={{width:"50px"}} alt={"submit"} src={"https://image.flaticon.com/icons/png/512/223/223120.png"}/>
                <label style={{position:"relative", left:"10px", top:"-20px", fontWeight:"bold", color:"greenyellow"}} >Save changes</label>
                <img alt={""} onClick={this.enviarBorrar} style={{cursor:"pointer", width:"40px", position: "relative", left:"480px"}} src={"https://vectorified.com/images/delete-icon-png-4.png"}/>
                <label style={{position:"relative", left:"490px", top:"-15px", color:"red", fontWeight:"bold"}} >Delete account</label>
                <input type={"image"} alt={""} src={"http://www.orion.on.ca/wp-content/uploads/2016/01/Security-Lock.png"} onClick={this.setState} style={{width:"50px"}}/>
                <label id={"accountVisibilityLabel"} style={{position:"relative", left:"20px", top:"-15px", color:"skyblue", fontWeight:"bold"}} ></label>
            </div>
        )
    }
    cambiarVerificaionEntrada(elementId, status){
        switch(status){
            case "Correct":{
                document.querySelector("#" + elementId).src = "https://vectorified.com/images/submit-icon-png-37.png";
                break;
            }
            case "Incorrect":{
                document.querySelector("#" + elementId).src = "https://www.shareicon.net/data/2015/09/15/101562_incorrect_512x512.png";
                break;
            }
            case "nada":{
                document.querySelector("#" + elementId).src = "";
                break;
            }
            default:{
                break;
            }
        }
    }
    componentDidMount(){
        this.fetchState();
    }
    fetchState = () => {
        fetch("http://localhost:5000/DataEdition/getVisibility", {
            method:"GET",
            credentials:"include"
        }).then(response => response.text())
        .then(text => {
            let label = document.querySelector("#accountVisibilityLabel");
            if (text === "true") label.innerHTML = "Go public";
            else label.innerHTML = "Go private";
        })
    }
    setState = () => {
        fetch("http://localhost:5000/DataEdition/setVisibility", {
            method:"GET",
            credentials:"include"
        }).then(() => {
            this.fetchState();
        })
    }
    verificarEntradaUsuario = () =>{
        let usernameInput = document.querySelector('[name="username"]').value;
        if (usernameInput.length === 0){
            this.cambiarVerificaionEntrada("usernameCheck", "nada");
        }
        else if (usernameInput.length > 25){
            this.cambiarVerificaionEntrada("usernameCheck", "Incorrect");
        }
        else{
            this.comprobaciondelservidor("usernameCheck", usernameInput);
        }
    }
    verificarEntradaEmail = () => {
        let mailInput = document.querySelector('[name="mail"]').value;
        if (mailInput.length === 0){
            this.cambiarVerificaionEntrada("mailCheck", "nada");
        }
        else{
            this.comprobaciondelservidor("mailCheck", mailInput);
        }
    }
    verifyCurrentPassInput = () => {
        let passInput = document.querySelector('[name="currentPass"]').value;
        if (passInput.length === 0){
            this.cambiarVerificaionEntrada("currentPassCheck", "Incorrect");
        }
        else{
            this.comprobaciondelservidor("currentPassCheck", passInput);
        }
    }
    verificarNuevaEntradaPass = () => {
        let passInput1 = document.querySelector('[name="newPass"]').value;
        let passInput2 = document.querySelector('[name="confirmation"]').value;
        if (passInput1.length === 0 && passInput2.length === 0){
            this.cambiarVerificaionEntrada("newPassCheck", "nada");
            this.cambiarVerificaionEntrada("newPassCheck2", "nada");
        }
        else if (passInput1 !== passInput2){
            this.cambiarVerificaionEntrada("newPassCheck", "Incorrect");
            this.cambiarVerificaionEntrada("newPassCheck2", "Incorrect");
        }
        else if ((passInput1.length < 6 || passInput2.length < 6) || 
        (passInput1.length > 32 || passInput2.length > 32)){
            this.cambiarVerificaionEntrada("newPassCheck", "Incorrect");
            this.cambiarVerificaionEntrada("newPassCheck2", "Incorrect");
        }
        else{
            this.cambiarVerificaionEntrada("newPassCheck", "Correct");
            this.cambiarVerificaionEntrada("newPassCheck2", "Correct");
        }
    }
    comprobaciondelservidor = (type, input) =>{
        fetch("http://localhost:5000/DataEdition/verify", {
            method:"POST",
            body:JSON.stringify({type:type, input:input}),
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            }
        }).then(response => response.text())
        .then(text => {
            if (text === "OK.") this.cambiarVerificaionEntrada(type, "Correct");
            else this.cambiarVerificaionEntrada(type, "Incorrect");
        })
    }
    enviar = () => {
        let body = new FormData(document.querySelector("#newDataForm"));
        fetch("http://localhost:5000/DataEdition/submitChanges", {
            method:"POST",
            credentials:"include",
            body:body
        }).then(response => response.text())
        .then(text => {
            if (text === "Changes saved."){
                ReactDOM.render(<Enrutar target={"profile"}/>, document.querySelector("#Div-1"));
            }
            else{
                document.querySelector("#mensaje").innerHTML = text;
            }
        })
    }
    enviarBorrar = () => {
        fetch("http://localhost:5000/DataEdition/deleteAccount", {
            method:"GET",
            credentials:"include"
        }).then(response => {
            if (response.status === 200){
                response.text().then(text => {
                    if (text === "Goodbye."){
                        this.cerrarSesion();
                    }
                })
            }
        })
    }
    cerrarSesion = () => {
        fetch("http://localhost:5000/LoginSingUp/Logout",{
            method:"GET",
            credentials:"include"
        }).then(response => {
            if (response.status === 200){
                let cookie = document.cookie.split("=")[0];
                document.cookie = cookie + "=; expires = Thu, 01 Jan 1970 00:00:00 UTC";
                ReactDOM.render(<Menu/>, document.querySelector("#root"));
                window.location.reload();
            }
        })
    }
}

export default EdicionPagina
