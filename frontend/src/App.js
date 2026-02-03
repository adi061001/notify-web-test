import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [enabled, setEnabled] = useState(false);
  const socketRef = useRef(null);

  const enableNotifications = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setEnabled(true);

      new Notification("Notifications Enabled ✅", {
        body: "You will now receive alerts",
      });

      // Connect to Socket.io server
      socketRef.current = io("https://notify-web-test-production.up.railway.app");

      // Listen for new notifications
      socketRef.current.on("newNotification", (notification) => {
        new Notification("🔔 New Notification", {
          body: notification.message,
        });
      });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Notification App</h2>
      <button onClick={enableNotifications}>Enable Notifications</button>
      
    </div>
  
  );
}

export default App;