import { io } from 'socket.io-client'
import { Message } from '../components/Message'
import { useEffect, useRef, useState } from 'react'

type msg = {
  user: string,
  text: string
}
const socket = io("http://localhost:3000")

function App() {

  const [msgs, setMsgs] = useState<msg[]>([])

  const [msgField, setMsgField] = useState<string>("")

  const [noRoom, setNoRoom] = useState<boolean>(true)


  const inputFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {

    socket.on("connect", () => {
      console.log("U connected")
    })

    socket.on("recieve-msg", (msg, user) => {
      displayMsg(user, msg)
    })

    socket.on("entered-room", (user) => {
      displayMsg(user, "Have joined the chat")
    })

    return () => {
      socket.off("connect")
      socket.off("recieve-msg")
      socket.off("entered-room")

    }

  }, [])


  function displayMsg(user: string, text: string) {
    setMsgs(prev => {
      return [...prev, { user: user, text: text }]
    })
  }

  function sendMessage() {
    if (inputFieldRef.current?.value !== "") {
      socket.emit('send-msg', msgField, socket.id, inputFieldRef.current?.value)

    } else {
      socket.emit('send-msg', msgField, socket.id, "")

    }
    displayMsg((socket.id)!.toString(), msgField)
  }

  function joinRoom() {
    socket.emit("join-room", inputFieldRef.current?.value, socket.id)
    setMsgs([])
    displayMsg((socket.id)!.toString(), `You have joined room ${inputFieldRef.current?.value}`)
  }

  useEffect(() => {
    return () => {
    }
  }, [])



  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <div className="font-black bg-amber-200 p-4 uppercase text-center select-none">
        Messages
      </div>

      {/* Scrollable Messages */}
      <div className="flex-1 overflow-y-auto px-4 mt-2">
        {msgs.map((msg: msg, index) => (
          <Message key={`${msg.user}-${msg.text}-${index}`} text={msg.text} name={msg.user} />
        ))}

        {noRoom && (
          <div className='font-bold flex w-full h-[80vh] justify-center select-none items-center'>Join a room to start chatting!</div>
        )}
      </div>

      {/* Footer Form */}
      <div className='flex flex-col md:flex-row w-full justify-center items-center gap-4 p-4 bg-white shadow-inner'>

        <div className="">
          <input
            type="text"
            ref={inputFieldRef}
            placeholder="Enter the room you want to join"
            className="bg-amber-300 p-4 rounded-2xl font-bold hover:bg-amber-500 transition"
          />
          <button
            onClick={() => {
              joinRoom()
              setNoRoom(false)
             }
            }
            className="font-bold uppercase p-4 bg-amber-200 rounded-2xl m-4 hover:bg-amber-400 transition-all cursor-pointer focus:bg-amber-400"
          >
            Join
          </button>
        </div>

        {!noRoom && (
          <div className="">
            <input
              onChange={(e) => setMsgField(e.target.value)}
              value={msgField}
              type="text"
              placeholder="Enter your message"
              className="bg-amber-300 p-4 rounded-2xl font-bold hover:bg-amber-500 transition"
            />
            <button
              onClick={sendMessage}
              className="font-bold uppercase p-4 bg-amber-200 rounded-2xl m-4 hover:bg-amber-400 transition-all cursor-pointer focus:bg-amber-400"
            >
              Send
            </button>
          </div>
        )}


      </div>
    </div>
  )

}

export default App
