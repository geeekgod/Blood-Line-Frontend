import React, { useState, useCallback, useContext } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import bloodLineApi from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { DataContext } from '../../context/DataContext';

const ChatBot = () => {

  const { user } = useContext(AuthContext);
  const { nearByRequests } = useContext(DataContext);

  const [messages, setMessages] = useState([]);

  const sendMessage = useCallback(async (message) => {
    bloodLineApi.post('/chatbot', { query: message }).then((res) => {

      const responseFromChatbot = res.data.response.split("\n");

      if (responseFromChatbot.length > 1 && responseFromChatbot[0] == "nearby_req") {
        if (nearByRequests.length > 0) {
          setMessages(previousMessages => GiftedChat.append(
            previousMessages,
            {
              _id: previousMessages.length + 1,
              text: responseFromChatbot[1],
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'Blood Line',
                avatar: require('../../assets/logo.png'),
              }
            }
          ))
          nearByRequests.map((request) => {
            setMessages(previousMessages => GiftedChat.append(
              previousMessages,
              {
                _id: previousMessages.length + 1,
                text: `Name: ${request.name}\nBlood Group: ${request.bloodGroup}\nContact: ${request.phone}\nLocation: ${request.address} ${request.city} ${request.pin}\nView on Map: https://maps.google.com/maps?q=${request.location[1]},${request.location[0]}`,
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: 'Blood Line',
                  avatar: require('../../assets/logo.png'),
                }
              }
            ))
          })
        }
        else {
          setMessages(previousMessages => GiftedChat.append(
            previousMessages,
            {
              _id: previousMessages.length + 1,
              text: responseFromChatbot[2],
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'Blood Line',
                avatar: require('../../assets/logo.png'),
              }
            }
          ))
        }
      }
      else {
        setMessages(previousMessages => GiftedChat.append(
          previousMessages,
          {
            _id: previousMessages.length + 1,
            text: responseFromChatbot[0],
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'Blood Line',
              avatar: require('../../assets/logo.png'),
            }
          }
        ))
      }
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
