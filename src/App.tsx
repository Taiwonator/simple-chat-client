import { useState, useRef, useEffect } from "react";
import ChatInput from "./components/blocks/ChatInput";
import Mobile from "./components/structure/Mobile";
import ChatBubble from "./components/blocks/ChatBubble";
import ChatScrollArea from "./components/blocks/ChatArea";
import { AddMessage, Message, Users } from "./types";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJqINYnH3uI1FIp3Rggrpcqq7k41nasTs",
  authDomain: "simple-chat-868c2.firebaseapp.com",
  projectId: "simple-chat-868c2",
  storageBucket: "simple-chat-868c2.firebasestorage.app",
  messagingSenderId: "205006752693",
  appId: "1:205006752693:web:905dbfa96b3c6c9e25e7fc",
  measurementId: "G-R81XB1Z8JS",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export const user = {
  id: "0",
  name: "Michael Taiwo",
  avatar: {
    src: "https://avatars.githubusercontent.com/u/22432591?v=4&size=64",
  },
};

function App() {
  const users: Users = {
    "0": user,
    "1": {
      id: "1",
      name: "Luffy",
      avatar: {
        src: "https://static.tvtropes.org/pmwiki/pub/images/straw_hat_pirates_jolly_roger.png",
      },
    },
    "2": {
      id: "2",
      name: "Brook",
      avatar: {
        src: "https://mystickermania.com/cdn/stickers/anime/one-brook-heart-512x512.png",
      },
    },
  };

  // const initialMessages: Message[] = [
  //   {
  //     id: "1",
  //     text: "Hey Lena, have you seen the latest episode?",
  //     timestamp: createMessageTimestamp(1),
  //     status: "Sent",
  //     userId: "1",
  //   },
  //   {
  //     id: "2",
  //     text: "Hey Jese! I did, can you believe that twist?",
  //     timestamp: createMessageTimestamp(2),
  //     status: "Sent",
  //     userId: "2",
  //   },
  //   {
  //     id: "3",
  //     text: "Right?! I didn’t see that coming at all.",
  //     timestamp: createMessageTimestamp(3),
  //     status: "Sent",
  //     userId: "1",
  //   },
  //   {
  //     id: "4",
  //     text: "Same here! Let’s chat more after I finish work?",
  //     timestamp: createMessageTimestamp(4),
  //     status: "Sent",
  //     userId: "2",
  //   },
  //   {
  //     id: "5",
  //     text: "Hey peeps! What’s up?",
  //     timestamp: createMessageTimestamp(5),
  //     status: "Sent",
  //     userId: "0",
  //   },
  //   {
  //     id: "6",
  //     text: "Hey Michael! We’re just talking about the latest episode.",
  //     timestamp: createMessageTimestamp(6),
  //     status: "Sent",
  //     userId: "1",
  //   },
  //   {
  //     id: "7",
  //     text: "I haven’t seen it yet. No spoilers!",
  //     timestamp: createMessageTimestamp(7),
  //     status: "Sent",
  //     userId: "0",
  //   },
  //   {
  //     id: "8",
  //     text: "No worries, I won’t spoil it for you.",
  //     timestamp: createMessageTimestamp(8),
  //     status: "Sent",
  //     userId: "2",
  //   },
  // ];

  const [messages, setMessages] = useState<Message[]>([]);
  const anchorRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    anchorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    let messages: Message[] = [];
    const messagesQuery = query(
      collection(db, "messages"),
      orderBy("timestamp", "asc"),
    );
    const querySnapshot = await getDocs(messagesQuery);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: data.id,
        text: data.text,
        timestamp: data.timestamp,
        status: data.status,
        userId: data.userId,
      });
    });
    setMessages(messages);
    setTimeout(scrollToBottom, 500);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const addMessage: AddMessage = async (message) => {
    setMessages([...messages, message]);
    setTimeout(
      () => anchorRef.current?.scrollIntoView({ behavior: "smooth" }),
      500,
    );

    try {
      const docRef = await addDoc(collection(db, "messages"), {
        id: message.id,
        text: message.text,
        timestamp: message.timestamp,
        status: message.status,
        userId: message.userId,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const [activeMessageId, setActiveMessageId] = useState<string>("");
  const setActiveMessage = (messageId: string) => {
    setActiveMessageId(messageId);
  };

  const getUserById = (userId: string) => users[userId] || null;

  return (
    <main className="flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
      <Mobile>
        <ChatScrollArea>
          {messages.map((message) => {
            return (
              <ChatBubble
                key={message.id}
                user={getUserById(message.userId)}
                message={message}
                setActiveMessage={setActiveMessage}
                __isActive={activeMessageId === message.id}
                __userIsMe={message.userId === user.id}
              />
            );
          })}
          <div id="anchor" ref={anchorRef} />
        </ChatScrollArea>
        <ChatInput addMessage={addMessage} />
      </Mobile>
    </main>
  );
}

export default App;
