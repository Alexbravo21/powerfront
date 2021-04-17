import './App.scss';

function App() {
  return (
    <div className="App">
        <h1>JS Chat</h1>
        <div id="chatHolder">
            <div id="chatHistory"></div>
            <div id="liveChat"></div>
            
        </div>
        <textarea id="chatInput" placeholder='Type your question here...'></textarea>
        <input id='chatSubmit' type="button" value='SEND'></input>
    </div>
  );
}

export default App;
