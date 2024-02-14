import React, { useState, useEffect } from "react";
import io from "socket.io-client";

let socket;
const CONNECTION_PORT = "localhost:3002";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const leftChat = "ml-auto rounded-tr-none"
  const rightChat = "mr-auto rounded-tl-none"
  const leftTime = "ml-auto"
  const rightTime = "mr-auto"

  useEffect(() => {
    socket = io(CONNECTION_PORT);
  }, [CONNECTION_PORT]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data]);
      console.log(messageList);
    });
  });
  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit("join_room", room);
  };

  const sendMessage = async () => {
    if (message !== "") {
      const now = new Date();
      const time = now.getHours() + ':' + now.getMinutes()
      let messageContent = {
        room: room,
        content: {
          author: userName,
          message: message,
          time: time
        },
      };
  
      await socket.emit("send_message", messageContent);
      setMessageList([...messageList, messageContent.content]);
      setMessage("");
      
    }
  };

  return (
    <div className="App bg-gray-900 min-h-screen flex w-full">
      {!loggedIn ? (
        <div className="m-auto p-10 h-56 flex bg-gray-800">
          <div className="inputs mx-auto">
            <input
              className="py-1 w-full px-2"
              type="text"
              placeholder="Enter your name"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
            <br />
            <input
              className="mt-5 py-1 w-full px-2"
              type="text"
              placeholder="Enter room id"
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />
            <button className="w-full bg-green-600 text-white mt-8 py-2" onClick={connectToRoom}>Enter Chat</button>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-h-screen flex rounded-lg">
          <div className="mt-10 mb-20 rounded-lg">
            <div className="h-full w-full md:w-[500px] bg-gray-800 p-5 border-8 border-b-0 border-gray-700">
            {
              messageList.map((val, key) => {
                return (<div key={key}>
                  <div
                    className="flex w-full my-3"
                    id={val.author == userName ? "You" : "Other"}
                  >
                    <div className={`${ userName !== val.author ? rightChat : leftChat } bg-green-600 rounded-md min-w-20 px-2 text-white`}>
                      {val.message}
                    </div>
                  </div>
                  <div
                    className="flex w-full my-3"
                    id={val.author == userName ? "You" : "Other"}
                  >
                    <div className={`${ userName !== val.author ? rightTime : leftTime } text-xs text-gray-300 -mt-3`}>
                      {val.time}
                    </div>

                  </div>
                </div>
                );
              })}
            </div>
            <div className="flex bg-gray-700 h-14">
              <div className="m-auto h-8">
                <input
                  className="w-96 py-1 px-2 rounded-l-md"
                  type="text"
                  placeholder="Message..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
                <button className="bg-green-600 w-20 px-2 py-1 text-white rounded-r-md" onClick={sendMessage}>Send</button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
