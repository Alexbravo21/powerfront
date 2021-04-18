import { useState, useEffect } from 'react';
import { operators } from '../enums/chat-operators';
import './chat.scss';
import sendImage from '../img/send.png';

let _events = {};
let callbacks;

function Chat() {

    const [chatImage, setChatImage] = useState('https://pf-cdn.inside-graph.com/custom/67-67-pf_chattab_apng.png');
    const [chatImageDescription, setChatImageDescription] = useState('Live chat icon, click here to open live chat panel');
    const [chats, setChats] = useState([{message: 'Loading chat history...'}]);
    const [inputMessage, setInputMessage] = useState('');
    const [newMessage, setNewMessage] = useState([]);
    const [botMessage, setBotMessage] = useState('');

    const operatorChat = () => {
		let randResponse = operators.responses[Math.floor(Math.random()*operators.responses.length)];
		dispatchChatEvent(randResponse, "operator");
	}
	const operatorAnswerChat = () => {
		let randResponse = operators.answers[Math.floor(Math.random()* operators.answers.length)];
		dispatchChatEvent(randResponse, "operator");
	}
	const operatorGreetingChat = () => {
		let randResponse = operators.greetings[Math.floor(Math.random()*operators.greetings.length)];
		dispatchChatEvent(randResponse, "operator");
	}

	const dispatchChatEvent = (msg, from) => {
		let event = new CustomEvent('chatreceived', {"detail":{datetime:new Date().toISOString(), message:msg, from:from}});
		// Listen for the event
		addListener('chatreceived', (e) => {
            if(e.chat.from === 'Visitor'){
                setNewMessage([...newMessage, inputMessage]);
            }else if(e.chat.from === 'operator'){
                setBotMessage(e.chat.message);
            }
        }, _events, false);

		// Dispatch the event.
		raiseEvent("chatreceived", {"chat":{datetime:new Date().toISOString(), message:msg, from:from}}, _events);
	}
    const addListener = (eventName, callback, events) => {
	 	callbacks = events[eventName] = events[eventName] || [];
		callbacks.push(callback);
	}

	const raiseEvent = (eventName, args, events) => {
		callbacks = events[eventName];
		if(typeof(callbacks) != "undefined") {
			for (var i = 0, l = callbacks.length; i < l; i++) {
			  callbacks[i](args);
			}
		}
	}

    const showChatPanel = () => {
        console.log('clickeado');
    }
    
    const sendChat = () => {
        let inputMsg = inputMessage;
        setInputMessage('');
		dispatchChatEvent(inputMsg, "Visitor");
		if(inputMsg.indexOf("hello") !== -1 || inputMsg.indexOf("hi") !== -1) {
			setTimeout(operatorGreetingChat, 2000);
		} else if(inputMsg.indexOf("?") !== -1) {
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
    
    useEffect(() => {
        setNewMessage((oldArray) => {
            if(oldArray === newMessage){
               return [...oldArray, botMessage];
            }else{
                return [...oldArray];
            }
        });
    }, [botMessage])


    return (
        <>
        <img src={chatImage} alt={chatImageDescription} className="chat-image" onClick={showChatPanel} />
        <div className="chat-window">
            <div className="chat-title">
                <h3>Botler (In training)</h3>
            </div>
            <div id="chatHolder">
                <div id="chatHistory">
                    {chats.map((chatLine, i) => {
                        return <p key={i}> {chatLine.message} </p>
                    })}
                </div>
                <div id="liveChat">
                    {newMessage.map((liveChatLine, i) => {
                        return <p key={i}> {liveChatLine} </p>
                    })}
                </div>
                
            </div>
            <textarea id="chatInput" placeholder='Type your question here...' onChange={(event) => {setInputMessage(event.target.value)}} value={inputMessage}></textarea>
            <div id="chatSubmit">
                <img className='sendImage' src={sendImage} onClick={sendChat} />
            </div>
        </div>
        </>
    )
}

export default Chat
