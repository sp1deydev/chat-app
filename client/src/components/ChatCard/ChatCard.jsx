import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import ScrollToBottom from 'react-scroll-to-bottom';

const { Title, Text } = Typography;

const ChatCard = ({username, roomId, socket, ...props}) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on('receive_message', (data) => {
        setMessages((list) => [...list, data])
    })
  }, [socket])

  const onFinish = async () => {
    if (message.trim()) {
      const payload = {
        author: username,
        roomId: roomId,
        message: message,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      }
      await socket.emit('send_message', payload);
      setMessages((list) => [...list, payload])
      setMessage('');
    }
  };

  const onLeave = async () => {
    await socket.disconnect();
    props.onLeave();
  } 

  return (
    
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
      <Card style={{ width: 400, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
        <Title level={5} style={{ textAlign: "center", backgroundColor: "red", color: "white", padding: "8px", borderRadius: "4px", marginTop: '0px', cursor: 'pointer'}} onClick={onLeave}>Leave the room</Title>
        <Title level={5} style={{ textAlign: "center",padding: "4px", borderRadius: "4px" }}>Room ID: {roomId}</Title>
        <div style={{ height: 250, border: "1px solid #d9d9d9", padding: "10px", borderRadius: "4px" }}>
        <ScrollToBottom  style={{ height: '100%', overflowY: "scroll", }}>
        <div style={{ height: 250}}>
          {messages.map((msg, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: msg.author === username ? "flex-end" : "flex-start", marginBottom: "10px" }}>
              <span style={{ padding: "6px 12px", borderRadius: "4px", color: "white", backgroundColor: msg.author === username ? "#52c41a" : "#1890ff" }}>
                {msg.message}
              </span>
              <Text type="secondary" style={{ fontSize: "12px" }}>{msg.time} <b>{msg.author}</b></Text>
            </div>
          ))}
        </div>
        </ScrollToBottom>
        </div>
        <Form onFinish={onFinish} layout="inline" style={{ marginTop: "10px", display: "flex"}}>
          <Form.Item style={{ flex: 1 }}>
            <Input 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Type a message..." 
            />
          </Form.Item>
          <Form.Item style={{marginInlineEnd: 0}}>
            <Button type="primary" htmlType="submit">Send</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChatCard;
