import React from "react";
import ReactDOM from "react-dom";
import {Resultados} from "./busquedaResultados";
import {RenderizarTweet} from "./tweet"
import {Enrutar} from "./rutaComponentes"
import {EscribirTweet} from "./escribir";
import EdicionPagina from "./edicionPerfil"
import Menu from "./paginaPrincipal";

class PaginalInicial extends React.Component{
    render() {
        ReactDOM.render(<BarraMenu/>, document.getElementById("root"));
        ReactDOM.render(<Perfil username={this.props.username}/>, document.getElementById("Div-1"));
        return(null);
    }
}

class BarraMenu extends React.Component{
    render() {
        return(
            <div style={{borderStyle:"groove", textAlign:"left", width:"1200px", height:"50px", borderColor:"deepskyblue", backgroundColor:"skyblue"}}>
                <p id={"Home"} style={{cursor:"pointer", position:"absolute", left:"95px", color:"black", fontWeight:"bold"}} onClick={this.renderizarFeed}>FEED</p>
                <img alt="" onClick={this.mostrarBusqueda} src={"https://cdn3.iconfinder.com/data/icons/block/32/search-512.png"} style={{cursor:"pointer", width:"25px", position:"absolute", left:"740px", top:"60px"}}/>
                <form onSubmit={this.busqueda} style={{position:"absolute", left:"500px", top: "62px"}}>
                    <input hidden={true} id={"searchBar"} type={"text"} style={{borderStyle:"solid", borderColor:"black", backgroundColor:"gray"}} placeholder={"Search..."}/>
                </form>
                <p id={"logo"} style={{position:"absolute", left: "605px", color:"black", fontWeight:"bold"}}>Twitter Clone</p>
                <p style={{cursor:"pointer", position:"absolute", left:"1145px", color:"black", fontWeight:"bold"}} id={"Profile"} onClick={this.renderizarperfil}>PROFILE</p>
                <img alt="" onClick={this.renderizarEscrito} src={"https://cdn1.iconfinder.com/data/icons/action-states-vol-4-1/48/Sed-04-512.png"} style={{position:"fixed", borderRadius:"50%", borderColor:"deepskyblue", borderStyle:"solid", backgroundColor:"deepskyblue", width:"65px", left:"1180px", top:"75%", cursor:"pointer"}}/>
            </div>
        );
    }

    renderizarEscrito = () => {
        ReactDOM.render(<EscribirTweet username={document.cookie.split("username=")[1]}/>, document.querySelector("#Div-1"))
    }

    busqueda = (e) => {
        e.preventDefault();
        let searchBar = document.querySelector("#searchBar");
        ReactDOM.render(<Resultados searchParam={searchBar.value}/>, document.querySelector("#Div-1"));
    }
    
    mostrarBusqueda = () => {
        let searchBar = document.querySelector("#searchBar");
        let logo = document.querySelector("#logo");
        searchBar.hidden = !searchBar.hidden;
        logo.style.left = searchBar.hidden ? "605px" : "385px";
    }

    renderizarperfil = () =>{
        ReactDOM.render(<Enrutar target={"perfil"}/>, document.getElementById("Div-1"));
    }
    renderizarFeed = () =>{
        ReactDOM.render(<Enrutar target={"feed"}/>, document.getElementById("Div-1"));
    }
}


class Perfil extends React.Component{
    render() {
        return(
            <div>
                <br/><br/>
                <img onClick={this.paginaEdicion} id={"editProfile"} hidden={true} alt={""} style={{position:"absolute", width:"30px", left:"720px", cursor:"pointer"}} src={"https://cdn.pixabay.com/photo/2015/12/04/22/20/gear-1077550_960_720.png"}/>
                <img alt="" id={"img"} onClick={this.buscarAvatar} style={{cursor:"pointer", borderRadius:"50%", borderStyle:"solid", borderColor:"deepskyblue", width:"100px"}}></img>
                <form id={"Avatar"}>
                    <input id={"browser"} onInput={this.cambiarAvatar} name={"newAvatar"} type={"file"} style={{display:"none"}}/>
                </form>
                <p id={"username"}>USER</p>
                <p id={"followersCount"} style={{color:"aquamarine"}}>Followers:</p>
                <p id={"followingCount"} style={{color:"aquamarine"}}>Following:</p>
                <button id={"FollowButton"} onClick={this.seguirDejarDeSeguir} style={{backgroundColor:"rgb(74,92,191)", borderColor:"black", color:"rgb(255,251,207)",width:"100px", height:"25px", borderRadius:"15%"}} hidden={true}></button>
                <button id={"LogoutButton"} onClick={this.cerrarSesion} style={{backgroundColor:"rgb(74,92,191)", borderColor:"black", color:"rgb(255,251,207)",width:"100px", height:"25px", borderRadius:"15%"}} hidden={true}>Logout</button>
                <br/><br/><br/>
                <div style={{borderStyle:"solid", borderColor:"gray", borderLeft:"none", borderRight:"none", fontWeight:"bold"}}>
                    <p style={{fontWeight:"bold"}}>Tweets</p>
                </div>
                <div id={"tweets"}></div>
            </div>
        );
    }

    componentDidMount() {
        if(document.cookie.split("username=")[1] !== this.props.username) {
            document.querySelector("#FollowButton").hidden = false;
            this.getButtonState();
        }
        else{
            document.querySelector("#LogoutButton").hidden = false;
            document.querySelector("#editProfile").hidden = false;
            ReactDOM.render(<RenderizarTweet param={"userTweets"} body={this.props.username}/>, document.querySelector("#tweets"));
        }
        this.obtenerPerfil();
    }
    paginaEdicion = () =>{
        ReactDOM.render(<EdicionPagina/>, document.querySelector("#Div-1"));
    }
    buscarAvatar = () => {
        if (document.cookie.split("username=")[1] === this.props.username){
            document.querySelector("#browser").click();
        }
    }

    seguirDejarDeSeguir = () => {
        fetch("http://localhost:5000/profileData/follow", {
            method:"POST",
            body: this.props.username,
            credentials:"include"
        }).then(response => response.text())
        .then(text => {
            let followButton = document.querySelector("#FollowButton");
            if (text === "Following") followButton.innerHTML = "Unfollow";
            else if (text === "Unfollowed") followButton.innerHTML = "Follow";
            this.obtenerRecuentoFollows();
        })
    }

    cambiarAvatar = () => {
        if (this.props.username !== null) {
            let form = document.querySelector("#Avatar");
            let formData = new FormData(form);
            fetch("http://localhost:5000/fileManager/upload", {
                method: "POST",
                credentials: "include",
                body: formData
            }).then(response => {
                if (response.status === 200){
                    ReactDOM.render(<Enrutar target={"profile"}/>, document.querySelector("#Div-1"));
                }
            })
        }
    }

    obtenerPerfil = () =>{
        if (this.props.username !== null) {
            document.querySelector("#username").innerHTML = this.props.username;
            this.obtenerRecuentoFollows();
            fetch("http://localhost:5000/fileManager/getAvatar", {
                method: "POST",
                credentials: "include",
                body: this.props.username ? this.props.username : ""
            }).then(response => response.blob())
            .then(response => {
                let url = URL.createObjectURL(response);
                document.querySelector("#img").src = url;
            })
        }
    }
    obtenerEstadoBoton = () => {
        fetch("http://localhost:5000/profileData/following", {
            method:"POST",
            body: this.props.username,
            credentials:"include"
        }).then(response => response.text())
        .then(text => {
            let followButton = document.querySelector("#FollowButton");
            if (text === "True") followButton.innerHTML = "Unfollow";
            else if (text === "False") followButton.innerHTML = "Follow";
            this.mostrarTweets(text);
        })
    }
    mostrarTweets = (follows) => {
        fetch("http://localhost:5000/DataEdition/getVisibility", {
            method:"GET",
            credentials:"include"
        }).then(response => {
            if (response.status === 200){
                response.text().then(text => {
                    if (text === "true"){
                        if (follows === "True"){
                            ReactDOM.render(<RenderizarTweet param={"userTweets"} body={this.props.username}/>, document.querySelector("#tweets"));
                        }
                    }
                    else{
                        ReactDOM.render(<RenderizarTweet param={"userTweets"} body={this.props.username}/>, document.querySelector("#tweets"));
                    }
                })
            }
        })
    }
    obtenerRecuentoFollows = () => {
        fetch("http://localhost:5000/profileData/userProfile", {
            method: "POST",
            credentials: "include",
            body: this.props.username
        }).then(response => response.json())
        .then(response => {
            document.querySelector("#followersCount").innerHTML = "Followers: " + response.followers;
            document.querySelector("#followingCount").innerHTML = "Following: " + response.follows;
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

export {BarraMenu, Perfil, PaginalInicial}