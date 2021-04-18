
	import { operators } from '../enums/chat-operators';

    
	let _events = {};
    let callbacks;

    export const operatorChat = () => {
		let randResponse = operators.responses[Math.floor(Math.random()*operators.responses.length)];
        //console.log(randResponse);
		dispatchChatEvent(randResponse, "operator");
	}
	export const operatorAnswerChat = () => {
		let randResponse = operators.answers[Math.floor(Math.random()* operators.answers.length)];
		dispatchChatEvent(randResponse, "operator");
	}
	export const operatorGreetingChat = () => {
		let randResponse = operators.greetings[Math.floor(Math.random()*operators.greetings.length)];
		dispatchChatEvent(randResponse, "operator");
	}

	export const dispatchChatEvent = (msg, from) => {
		let event = new CustomEvent('chatreceived', {"detail":{datetime:new Date().toISOString(), message:msg, from:from}});

		// Listen for the event
		addListener('chatreceived', function (e) { console.log(event.detail.message, event.detail.from) }, _events, false);

		// Dispatch the event.
		raiseEvent("chatreceived", {"chat":{datetime:new Date().toISOString(), message:msg, from:from}}, _events);
	}
    export const addListener = (eventName, callback, events) => {
	 	callbacks = events[eventName] = events[eventName] || [];
		callbacks.push(callback);
	}

	export const raiseEvent = (eventName, args, events) => {
		callbacks = events[eventName];
		if(typeof(callbacks) != "undefined") {
			for (var i = 0, l = callbacks.length; i < l; i++) {
			  callbacks[i](args);
			}
		}
	}