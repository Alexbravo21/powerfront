import { useState, useEffect, useRef } from 'react';
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
    const [chatHidden, setChatHidden] = useState(true);

    const liveChatRef = useRef(null);

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
		let event = new CustomEvent('chatreceived', {"detail":{datetime:new Date().toLocaleString(), message:msg, from:from}});
		// Listen for the event
		addListener('chatreceived', (e) => {
            let d = new Date();
            d.setTime(d.getTime()-200000);
            if(e.chat.from === 'visitor'){
                setNewMessage([...newMessage, {message:inputMessage, from: 'visitor', datetime:new Date(d.setTime(d.getTime()+2000)).toLocaleString()}]);
            }else if(e.chat.from === 'operator'){
                setBotMessage(e.chat.message);
            }
        }, _events, false);

		// Dispatch the event.
		raiseEvent("chatreceived", {"chat":{datetime:new Date().toLocaleString(), message:msg, from:from}}, _events);
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
        setChatHidden(!chatHidden);
        getChatHistory();
    }
    
    const sendChat = () => {
        let inputMsg = inputMessage;
        setInputMessage('');
		dispatchChatEvent(inputMsg, "visitor");
		if(inputMsg.indexOf("hello") !== -1 || inputMsg.indexOf("hi") !== -1) {
			setTimeout(operatorGreetingChat, 1000);
		} else if(inputMsg.indexOf("?") !== -1) {
			setTimeout(operatorAnswerChat, 1000);
		} else {
			setTimeout(operatorChat, 1000);
		}
	}
    const getChatHistory = () => {
		let d = new Date();
		d.setTime(d.getTime()-200000);
        let history = []
		history.push({datetime:new Date(d.setTime(d.getTime()+2000)).toLocaleString(), message:"hello", from:"visitor"});
		history.push({datetime:new Date(d.setTime(d.getTime()+4000)).toLocaleString(), message:"Hi, how can I help you?", from:"operator"});
		history.push({datetime:new Date(d.setTime(d.getTime()+4000)).toLocaleString(), message:"I'm looking for a size 7, but can't find it", from:"visitor"});
		history.push({datetime:new Date(d.setTime(d.getTime()+4000)).toLocaleString(), message:"Ok, one moment I'll check the stock", from:"operator"})
		history.push({datetime:new Date(d.setTime(d.getTime()+10000)).toLocaleString(), message:"I'm sorry, there is no sie 7 available in that colour. There are some in red and blue however", from:"operator"})
		history.push({datetime:new Date(d.setTime(d.getTime()+4000)).toLocaleString(), message:"Oh great, thank you", from:"visitor"});
		history.push({datetime:new Date(d.setTime(d.getTime()+4000)).toLocaleString(), message:"my pleasure :-)", from:"operator"});
			
        setTimeout(() => {
            setChats([...history]);
        }, 1000);
	}
    
    useEffect(() => {
        setNewMessage((oldArray) => {
            if(oldArray === newMessage){
                let d = new Date();
                d.setTime(d.getTime()-200000);
               return [...oldArray, {message: botMessage, from: 'operator', datetime:new Date(d.setTime(d.getTime()+2000)).toLocaleString()}];
            }else{
                return [...oldArray];
            }
        });
    }, [botMessage])

    useEffect(() => {
        liveChatRef.current.scrollTop = liveChatRef.current.scrollHeight;
    }, [newMessage])


    return (
        <>
        <img src={chatImage} alt={chatImageDescription} className="chat-image" onClick={showChatPanel} />
        <div className={`chat-window chat-${chatHidden ? 'hidden' : 'shown'}`}>
            <div className="chat-title">
                <h3>Botler (In training)</h3>
                <div className="arrow" onClick={showChatPanel}></div>
            </div>
            <div id="chatHolder">
                <div id="chatHistory">
                    {chats.map((chatLine, i) => {
                        return (
                            <>
                                <p key={i+'a'} className={chatLine.from}> {chatLine.message} </p>
                                <span key={i+'b'} className="date-history">{chatLine.datetime}</span>
                            </>
                        )
                    })}
                </div>
                <div id="liveChat" ref={liveChatRef}>
                    {newMessage.map((liveChatLine, i) => {
                        if(liveChatLine.message !== null && liveChatLine.message !== ''){
                            return (
                                <>
                                    <div className={`container-${liveChatLine.from}`} key={i+'a'}><p key={i+'b'} className={liveChatLine.from}> {liveChatLine.message} </p></div>
                                    <span className="date-live" key={i+'c'}>{liveChatLine.datetime}</span>
                                </>
                            )
                        }else{
                            return false;
                        }
                    })}
                </div>
                
            </div>
            <div className="input-container">
                <textarea id="chatInput" placeholder='Type your question here...' onChange={(event) => {setInputMessage(event.target.value)}} value={inputMessage}></textarea>
                <div id="chatSubmit">
                    <img className='sendImage' src={sendImage} onClick={sendChat} />
                </div>
            </div>
        </div>
        </>
    )
}

export default Chat
