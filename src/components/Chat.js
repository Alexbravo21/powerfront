import { useState, useEffect } from 'react';
import { operatorChat, dispatchChatEvent, operatorGreetingChat, operatorAnswerChat } from '../utils/chat-utils';
import './chat.scss';

function Chat() {

    const [chats, setChats] = useState([{message: 'Loading chat history...'}]);
    const [newmessage, setNewMessage] = useState('');
    
    const sendChat = (str) => {
		dispatchChatEvent(str, "Visitor");
		if(str.indexOf("hello") !== -1 || str.indexOf("hi") !== -1) {
			setTimeout(operatorGreetingChat, 2000);
		} else if(str.indexOf("?") !== -1) {
			setTimeout(operatorAnswerChat, 2000);
		} else {
			setTimeout(operatorChat, 2000);
		}
	}
    const getChatHistory = () => {
		let d = new Date();
		d.setTime(d.getTime()-200000);
        let history = []
		history.push({datetime:new Date(d.setTime(d.getTime()+2000)).toISOString(), message:"hello", from:"Visitor"});
		history.push({datetime:new Date(d.setTime(d.getTime()+4000)).toISOString(), message:"Hi, how can I help you?", from:"Operator"});
		history.push({datetime:new Date(d.setTime(d.getTime()+4000)).toISOString(), message:"I'm looking for a size 7, but can't find it", from:"Visitor"});
		history.push({datetime:new Date(d.setTime(d.getTime()+4000)).toISOString(), message:"Ok, one moment I'll check the stock", from:"Operator"})
		history.push({datetime:new Date(d.setTime(d.getTime()+10000)).toISOString(), message:"I'm sorry, there is no sie 7 available in that colour. There are some in red and blue however", from:"Operator"})
		history.push({datetime:new Date(d.setTime(d.getTime()+4000)).toISOString(), message:"Oh great, thank you", from:"Visitor"});
		history.push({datetime:new Date(d.setTime(d.getTime()+4000)).toISOString(), message:"my pleasure :-)", from:"Operator"});
			
        setTimeout(() => {
            setChats([...history]);
        }, 1000);
	}

    useEffect(() => {
        getChatHistory();
    }, [])


    return (
        <div className="chat-window">
            <div id="chatHolder">
                <div id="chatHistory">
                    {chats.map((chatLine, i) => {
                        return <p key={i}> {chatLine.message} </p>
                    })}
                </div>
                <div id="liveChat"></div>
                
            </div>
            <textarea id="chatInput" placeholder='Type your question here...'></textarea>
            <input id='chatSubmit' type="button" value='SEND'></input>
        </div>
    )
}

export default Chat
