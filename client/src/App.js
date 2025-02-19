import { NumberOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";
import { React, useState } from "react";
import io from 'socket.io-client';
import './App.css';
import ChatCard from "./components/ChatCard/ChatCard";

const socket = io.connect('http://localhost:3001')

function App() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isJoinChat, setIsJoinChat] = useState(false);

  const onFinish = (values) => {
    socket.emit('join_room', values.roomId);
    setUsername(values.username);
    setRoomId(values.roomId);
    setIsJoinChat(true);
  };

  const handleLeaveChat = () => {
    setIsJoinChat(false);
    setUsername('');
    setRoomId('');
  }

  return (
    <div className="App">
      {!isJoinChat ?
      <Card className="w-96 shadow-lg join-chat">
        <h2 className="text-2xl font-bold text-center mb-4">Join A Chat</h2>
        <Form name="joinChat" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="roomId"
            rules={[{ required: true, message: "Please input a room ID!" }]}
          >
            <Input prefix={<NumberOutlined />} placeholder="Room ID..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full bg-green-600 hover:bg-green-700">
              Join
            </Button>
          </Form.Item>
        </Form>
      </Card>
      :
      <ChatCard username={username} roomId={roomId} socket={socket} onLeave={handleLeaveChat}/>
      }
  </div>
  );
}

export default App;
