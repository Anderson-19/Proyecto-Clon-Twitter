import React from "react"
import ReactDOM from "react-dom"
import {RenderizarTweet} from "./tweet"

class EnfoqueTweet extends React.Component{
    render(){
        return(
            <div>
                <div id={"focusedTweetRoot"}></div>
                <div id={"commentsDiv"}></div>
            </div>
        )
    }
    componentDidMount(){
        ReactDOM.render(<RenderizarTweet param={"tweetById"} body={this.props.referencedTweet}/>, document.querySelector("#focusedTweetRoot"));
        ReactDOM.render(<RenderizarTweet param={"comments"} body={this.props.referencedTweet} renderComments={true}/>, document.querySelector("#commentsDiv"));
    }
}

export{EnfoqueTweet}