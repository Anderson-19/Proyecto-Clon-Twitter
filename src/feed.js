import React from "react"
import ReactDOM from "react-dom"
import {RenderizarTweet} from "./tweet"

class FeedPage extends React.Component{
    render(){
        return(
            <div id={"feedDiv"}></div>
        )
    }
    componentDidMount(){
        ReactDOM.render(<RenderizarTweet param={"feedTweets"}/>, document.querySelector("#feedDiv"));
    }
}

export{FeedPage}