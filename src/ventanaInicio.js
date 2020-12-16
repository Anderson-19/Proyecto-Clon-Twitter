import React from "react";
import ReactDOM from "react-dom";
import {PaginaInicio} from "./paginaInicio"

class Registro extends React.Component {
    render() {
        return(
            <div>
                <br/><br/><br/>
                <p id={"Mensaje1"}></p>
                <p id={"Mensaje2"}></p>
                <p id={"Mensaje3"}></p>
                <br/>
                <form id={"RegisterForm"}>
                    <label>Username:     </label>
                    <input id={"username"} onInput={this.validarUsuario} type={"text"} name={"name"} placeholder={"username"}/><br/><br/>
                    <label>Email:     </label>
                    <input id={"mail"} onInput={this.validarEmail} name={"email"} placeholder={"Example@gmail.com"}/><br/><br/>
                    <label>Password:    </label>
                    <input id={"pass1"} onInput={this.chequearPassword} type={"password"} name={"Pass"} placeholder={"password"}/><br/><br/>
                    <label>Confirm password:    </label>
                    <input id={"pass2"} onInput={this.chequearPassword} type={"password"} name={"Pass"} placeholder={"Confirm password"}/><br/><br/>
                    <input type={"button"} value={"Registrar"} onClick={this.envioRegistro}/>
                </form>
            </div>
        )
    }
    envioRegistro = () =>{
        if (this.state.passMatch && this.state.validMail && this.state.validUser) {
            let RegisterForm = document.querySelector("#RegisterForm");
            let myFormData = new FormData(RegisterForm);
            fetch("http://localhost:5000/loginSingUp/SingUp", {
                method: "POST",
                body: myFormData
            }).then(response => response.text())
                .then((response) => {
                    let messageContainer = document.querySelector("#Mensaje1");
                    if (response.includes("completed")) {
                        messageContainer.style.color = "green";
                    } else {
                        messageContainer.style.color = "red";
                    }
                    messageContainer.innerHTML = response;
                });
        }
    }
    chequearPassword = () =>{
        let pass1 = document.querySelector("#pass1");
        let pass2 = document.querySelector("#pass2");
        let messageContainer = document.querySelector("#Mensaje1");
        if (pass1.value !== pass2.value){
            this.setState({passMatch: false});
            messageContainer.style.color = "red";
            messageContainer.innerHTML = "Passwords do not match.";
        }
        else{
            if (pass1.value.length < 6 || pass1.value.length > 32){
                this.setState({passMatch: false});
                messageContainer.style.color = "red";
                messageContainer.innerHTML = "Password length must be between 6 to 32 characters.";
            }
            else {
                this.setState({passMatch: true});
                messageContainer.innerHTML = "";
            }
        }
    }
    validarUsuario = () =>{
        let username = document.querySelector("#username").value;
        let messageContainer = document.querySelector("#Mensaje3");
        if (username.length > 32){
            this.setState({validUser: false});
            messageContainer.style.color = "";
            messageContainer.innerHTML = "Username too long.";
        }
        else if (username.length === 0){
            this.setState({validUser: false});
            messageContainer.innerHTML = "";
        }
        else{
            this.setState({validUser: true});
            messageContainer.innerHTML = "";
        }
    }
    validarEmail = () =>{
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let email = document.querySelector("#mail");
        let messageContainer = document.querySelector("#Mensaje2");
        let result = re.test(email.value);
        if (result){
            this.setState({validMail: true});
            messageContainer.innerHTML = "";
        }
        else{
            this.setState({validMail: false});
            if (email.value === ""){
                messageContainer.innerHTML = "";
            }
            else {
                messageContainer.style.color = "red";
                messageContainer.innerHTML = "E-Mail address is not valid.";
            }
        }
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {passMatch: false, validMail: false, validUser: false};
    }
    render() {
        return(
            <div>
                <br/><br/><br/>
                <p id={"Error"}></p>
                <br/>
               <form id={"LoginForm"}>
                   <label>Username:     </label>
                   <input id={"username"} type={"text"} name={"name"} placeholder={"username"}/><br/><br/>
                   <label>Password:    </label>
                   <input type={"password"} name={"pass"} placeholder={"password"}/><br/><br/>
                   <input type={"button"} value={"Login"} onClick={this.envioLogin}/>
               </form>
            </div>
        )
    }
    envioLogin = () =>{
        let LoginForm = document.querySelector("#LoginForm");
        let myFormData = new FormData(LoginForm);
        fetch("http://localhost:5000/LoginSingUp/Login", {
            method:"POST",
            body: myFormData,
            credentials:"include"
        }).then(response => response.text())
            .then(response => {
                if (response.includes("successful")){
                    let username = document.querySelector("#username").value;
                    document.cookie = "username=" + username;
                    ReactDOM.render(<PaginaInicio username={username}/>, document.getElementById("Div-1"));
                }
                else{
                    let errorDisplay = document.querySelector("#Error");
                    errorDisplay.style.color = "red";
                    errorDisplay.innerHTML = response;
                }
            })
    }
}

export { Registro,Login};