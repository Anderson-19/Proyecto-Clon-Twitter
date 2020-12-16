import React from "react";
import ReactDOM from "react-dom"
import {Tweet} from "./Componentetweet"
import {ComentarioRetweet} from "./tweet-con-comentario"

class RenderizarTweet extends React.Component{
    render(){
        this.obtenerTweets();
        return(
            <div>
                <div id={"tweetDiv"}></div>
                <div id={"commentsDIV"}></div>
            </div>
        )
    }
    obtenerTweets = () => {
        let url;
        switch (this.props.param){
            case "userTweets":{
                url = "http://localhost:5000/makeApost/getUserTweets";
                break;
            }
            case "tweetById":{
                url = "http://localhost:5000/makeApost/getTweetById";
                break;
            }
            case "tweetByText":{
                url = "http://localhost:5000/makeApost/getTweetByText";
                break;
            }
            case "feedTweets":{
                url = "http://localhost:5000/makeApost/getFeedTweets";
                break;
            }
            case "comments":{
                url = "http://localhost:5000/makeApost/getTweetComments";
                break;
            }
            default:{
                break;
            }
        }
        fetch(url, {
            method:"POST",
            body:this.props.body,
            credentials:"include"
        }).then(response => response.json())
        .then(json => {
            if (json.nada){console.log("Nothing to show")}
            else{
                let tweets = [];
                if (this.props.param === "tweetById"){
                    if(json.type === "comment" || json.type === "originalPost" || json.type === "rt")
                        tweets[0] = <Tweet type={json.type} username={json.username} tweetid={json.tweetid} referencedtweet={json.referencedtweet}/>;
                    else if (json.type === "rtWithComment" || json.type === "rtWithComment2")
                        tweets[0] = <ComentarioRetweet type={json.type} tweetid={json.tweetid} username={json.username} referencedtweet={json.referencedtweet}/>
                }
                else{
                    for (let i = 0; i < json.length; i++){
                        if (json[i].type === "rtWithComment"){
                            tweets[i] = <ComentarioRetweet type={json[i].type} tweetid={json[i].tweetid} username={json[i].username} referencedtweet={json[i].referencedtweet}/>;
                        }
                        else{
                            if (json[i].type === "rtWithComment2"){
                                tweets[i] = <ComentarioRetweet type={json[i].type} tweetid={json[i].tweetid} username={json[i].username} referencedtweet={json[i].referencedtweet}/>;
                            }
                            else if (json[i].type === "comment"){
                                if (this.props.renderComments){
                                    tweets[i] = <Tweet type={json[i].type} username={json[i].username} tweetid={json[i].tweetid} referencedtweet={json[i].referencedtweet}/>;
                                }
                            }
                            else{
                                tweets[i] = <Tweet type={json[i].type} username={json[i].username} tweetid={json[i].tweetid} referencedtweet={json[i].referencedtweet}/>;
                            }
                        }
                    }
                }
                if (this.props.renderComments){
                    ReactDOM.render(tweets, document.querySelector("#commentsDIV"));
                }
                else{
                    ReactDOM.render(tweets, document.querySelector("#tweetDiv"));
                }
            }
        })
    }
}

export{RenderizarTweet}