import { useState, useRef, useEffect, useContext } from "react";
import Mobile from "../../structure/Mobile";
import ChatBubble from "./blocks/ChatBubble";
import ChatInput from "./blocks/ChatInput";
import ChatScrollArea from "./blocks/ChatArea";
import { AddMessage, Message, ResolvedMessage, ToggleReaction } from "../../../types";
import { FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { UserContext } from "../../../context/UserContext";
import DayBubble from "./blocks/DayBubble";

interface Props {
  firebaseApp: FirebaseApp;
  isBlurred: boolean;
}

function Chat({ firebaseApp, isBlurred }: Props) {
  const db = getFirestore(firebaseApp);
  const { user, findUserById } = useContext(UserContext);

  const [messages, setMessages] = useState<ResolvedMessage[]>([]);
  const [activeMessageId, setActiveMessageId] = useState<string>("");
  const anchorRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    anchorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = () => {
    const messagesQuery = query(
      collection(db, "messages"),
      orderBy("timestamp", "asc"),
    );

    const unsubscribe = onSnapshot(messagesQuery, async (querySnapshot) => {
      let newMessages: ResolvedMessage[] = [];
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        const message: Message = {
          id: doc.id,
          text: data.text,
          timestamp: data.timestamp,
          status: data.status,
          userId: data.userId,
          reactions: data.reactions || {}
        }
        const user = await findUserById(data.userId);
        newMessages.push({ ...message, __user: user, __isFirstOfTheDay: false });
      }
      const firstOfTheDayMap: { [key: string]: string } = {}
      const createKey = (timestamp: string) => new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(timestamp))
      for (let i = newMessages.length - 1; i >= 0; i--) {
        const messageKey = createKey(newMessages[i].timestamp)
        firstOfTheDayMap[messageKey] = newMessages[i].id
      }
      newMessages = newMessages.map((message) => ({
        ...message,
        __isFirstOfTheDay: firstOfTheDayMap[createKey(message.timestamp)] === message.id
      }))
      console.log('firstOfTheDayMap', firstOfTheDayMap)
      setMessages(newMessages);
      if (!isBlurred) setTimeout(() => scrollToBottom(), 500);
    });

    return unsubscribe;
  };

  const addMessage: AddMessage = async (message) => {
    setMessages([...messages, message]);
    setTimeout(() => scrollToBottom(), 500);

    try {
      const docRef = await addDoc(collection(db, "messages"), {
        id: message.id,
        text: message.text,
        timestamp: message.timestamp,
        status: message.status,
        userId: message.userId,
        reactions: message.reactions || {},
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const setActiveMessage = (messageId: string) => {
    setActiveMessageId(messageId);
  };

  const toggleReaction: ToggleReaction = async (messageId, emoji) => {
    if (!user) return;

    try {
      // Get the current message
      const messageRef = doc(db, "messages", messageId);
      const messageSnap = await getDoc(messageRef);

      if (!messageSnap.exists()) {
        console.error("Message not found");
        return;
      }

      const messageData = messageSnap.data();
      const reactions = messageData.reactions || {};
      const emojiReactions = reactions[emoji] || [];

      // Check if user already reacted with this emoji
      const userReactionIndex = emojiReactions.findIndex(
        (reaction: { userId: string }) => reaction.userId === user.id
      );

      let updatedReactions = { ...reactions };

      if (userReactionIndex >= 0) {
        // Remove reaction if it exists
        updatedReactions[emoji] = emojiReactions.filter(
          (_: any, index: number) => index !== userReactionIndex
        );

        // Remove empty emoji arrays
        if (updatedReactions[emoji].length === 0) {
          delete updatedReactions[emoji];
        }
      } else {
        // Add reaction if it doesn't exist
        updatedReactions[emoji] = [
          ...emojiReactions,
          { emoji, userId: user.id }
        ];
      }

      // Update the message with new reactions
      await updateDoc(messageRef, {
        reactions: updatedReactions
      });

      console.log("Reaction toggled successfully");
    } catch (error) {
      console.error("Error toggling reaction:", error);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <Mobile isBlurred={isBlurred}>
      <ChatScrollArea>
        {messages.length === 0 && (
          <div key="loading" className="m-auto flex size-20 items-center justify-center rounded-lg">
            <div role="status">
              <svg aria-hidden="true" className="size-8 animate-spin fill-gray-400 text-gray-200 dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        {messages.map((message) => {
          return (
            <>
              {message.__isFirstOfTheDay && <DayBubble key={message.timestamp} timestamp={message.timestamp} />}
              <ChatBubble
                key={message.id}
                user={message.__user}
                message={message}
                setActiveMessage={setActiveMessage}
                toggleReaction={toggleReaction}
                __isActive={activeMessageId === message.id}
                __userIsMe={user ? message.userId === user.id : false}
              />
            </>
          );
        })}
        <div id="anchor" key="anchor" ref={anchorRef} />
      </ChatScrollArea>
      <ChatInput addMessage={addMessage} />
    </Mobile>
  );
}



export default Chat;
