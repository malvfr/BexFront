import React, { createContext, useState, useEffect } from 'react';
import { Socket } from 'phoenix';

const SocketContext = createContext<Socket>({} as Socket);
const SocketConsumer = SocketContext.Consumer;

const SocketProvider: React.FC = ({ children }) => {
    let [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        let phxSocket = new Socket("ws://localhost:4000/socket", { params: { token: "123" } })
        phxSocket.connect();

        setSocket(phxSocket);

        return () => phxSocket.disconnect(() => console.log("socket closed"));

    }, []);

    if (!socket) return null;

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export { SocketProvider, SocketConsumer };
export default SocketContext;