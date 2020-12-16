import React from "react";
import ReactDOM from "react-dom";
import {Perfil} from "./paginaInicio";
import {RenderizarTweet} from "./tweet"

class Resultados extends React.Component{
    render() {
        return(
            <div>
                <br/>
                <p style={{fontWeight:"bold", fontSize:"x-large"}}>Usuarios</p>
                <p style={{borderBottom:"groove", borderColor:"rgb(88,86,86)"}}></p>
                <div id={"UList"}></div>
                <p style={{fontWeight:"bold", fontSize:"x-large"}}>Tweets</p>
                <p style={{borderBottom:"groove", borderColor:"rgb(88,86,86)"}}></p>
                <div id={"TList"}></div>
            </div>
        )
    }
    componentDidMount() {
        ReactDOM.render(<ResultadosUsuario searchParam={this.props.searchParam}/>, document.querySelector("#UList"));
        ReactDOM.render(<RenderizarTweet param={"tweetByText"} body={this.props.searchParam}/>, document.querySelector("#TList"));
    }
}

class ResultadosUsuario extends React.Component{
    render() {
        return(
            <div id={"userResultsDiv"}></div>
        )
    }
    componentDidMount() {
        this.obtenerUsuarios();
    }
    obtenerUsuarios = () => {
        fetch("http://localhost:5000/profileData/userList", {
            method:"POST",
            body:this.props.searchParam,
            credentials:"include"
        }).then(response => response.text())
            .then(text => {
                let firstSplit = text.split('|');
                let secondSplit = [];
                for (let i = 0; i < firstSplit.length; i++){
                    if (firstSplit[i].length > 1){
                        secondSplit[i] = firstSplit[i].split("username" + i + " : ")[1];
                    }
                }
                this.mostrarUsuarios(secondSplit);
            })
    }
    mostrarUsuarios = (Usernames) => {
        let componentDiv = document.querySelector("#userResultsDiv");
        let components = []
        for (let i = 0; i < Usernames.length; i++) {
            components[i] = <UsuarioComponente username={Usernames[i]}/>
        }
        ReactDOM.render(components, componentDiv);
    }
}

class UsuarioComponente extends React.Component{
    render() {
        this.ObtenerAvatar();
        return (
            <div>
                <div id={"UserDiv"} style={{textAlign:"center", borderStyle:"groove", borderColor:"#585858", backgroundColor:"rgb(69,67,67)", borderRadius:"10%", width:"225px"}}>
                    <img alt={""} id={"Avatar" + this.props.username} onClick={this.mostrarProfile} style={{cursor:"pointer", position:"absolute", left:"75px", borderStyle:"solid", borderColor:"deepskyblue", borderRadius:"50%", width:"35px"}}/>
                    <p onClick={this.mostrarProfile} style={{cursor:"pointer"}}>{this.props.username}</p>
                </div>
                <br/>
            </div>
        )
    }
    ObtenerAvatar = () =>{
        fetch("http://localhost:5000/fileManager/getAvatar", {
            method:"POST",
            body:this.props.username,
            credentials: "include"
        }).then(response => response.blob())
            .then(blob => {
                let url = URL.createObjectURL(blob);
                document.querySelector("#Avatar" + this.props.username).src = url;
            })
    }
    mostrarProfile = () =>{
        ReactDOM.render(<Perfil username={this.props.username}/>, document.querySelector("#Div-1"));
    }
}

export {Resultados}