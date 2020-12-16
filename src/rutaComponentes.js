import react from "react";
import ReactDOM from "react-dom";
import {EnfoqueTweet} from "./tweetEnfocado"
import {Perfil} from "./paginaInicio"
import {FeedPage} from "./feed"

class Enrutar extends react.Component{
    render(){
        return(null)
    }
    componentDidMount(){
        switch(this.props.target){
            case "focusedTweet":{
                ReactDOM.render(<EnfoqueTweet referencedTweet={this.props.referencedTweet}/>, document.querySelector("#Div-1"));
                break;
            }
            case "profile":{
                ReactDOM.render(<Perfil username={document.cookie.split("username=")[1]}/>, document.querySelector("#Div-1"));
                break;
            }
            case "feed":{
                ReactDOM.render(<FeedPage/>, document.querySelector("#Div-1"));
                break;
            }
            default:{
                break;
            }
        }
    }
}

export{Enrutar}