"use client"

import { createContext, useContext, useState, useEffect } from "react"
import SockJS from "sockjs-client"
import { Client } from "@stomp/stompjs"
import AsyncStorage from '@react-native-async-storage/async-storage';
const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [activeNotification, setActiveNotification] = useState(null)

  useEffect(() => {
  const connectWebSocket = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token) return;

    const socket = new SockJS("http://192.168.1.189:8083/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      debug: (str) => console.log("STOMP:", str),
      onConnect: () => {
        console.log("✅ Connected to WebSocket server");
        stompClient.subscribe("/user/queue/notifications", (msg) => {
          console.log("📩 Private message:", msg.body);
          setMessages((prev) => [...prev, msg.body]);
        });
      },
    });

    stompClient.activate();
    return () => stompClient.deactivate();
  };

  connectWebSocket();
}, []);

  const showNotification = (notification) => {
    setActiveNotification(notification)
    // Auto hide after 4 seconds
    setTimeout(() => {
      setActiveNotification(null)
    }, 4000)
  }

  const hideNotification = () => {
    setActiveNotification(null)
  }

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const value = {
    notifications,
    activeNotification,
    showNotification,
    hideNotification,
    markAsRead,
    clearNotification,
    clearAllNotifications,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
