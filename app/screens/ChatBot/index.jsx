import React, { useState, useCallback, useContext } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import bloodLineApi from '../../api';
import { AuthContext } from '../../context/AuthContext';

const ChatBot = () => {

  const {user} = useContext(AuthContext);

  const [messages, setMessages] = useState([]);

  const sendMessage = useCallback(async (message) => {
    bloodLineApi.post('/chatbot', { query: message }).then((res) => {
      console.log("Response from chatbot", res.data.response);
      setMessages(previousMessages => GiftedChat.append(
        previousMessages,
        {
          _id: previousMessages.length + 1,
          text: res.data.response,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Blood Line',
            avatar: require('../../assets/logo.png'),
          }
        }
      ))
    }).catch((err) => {
      console.log("Error while sending message", err);
    })
  }, [])


  const onSend = useCallback(async (messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, {
      _id: previousMessages.length + 1,
      text: messages[0].text,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: user.name,
        avatar: user.imageUrl,
      }
    }))
    await sendMessage(messages[0].text)
  }, [])

  return (
    <GiftedChat
      messages={messages}
      showUserAvatar={true}
      showAvatarForEveryMessage={true}
      placeholder='Enter your query here...'
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  )
}

export default ChatBot;
