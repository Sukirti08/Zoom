import { Server } from "socket.io";

export const connectToSocket = (server) => {
    const rooms = new Map();
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        const joinedRooms = new Set();

        socket.on("join-call", (path) => {
            if (typeof path !== "string" || !path.trim() || path.length > 1024 || joinedRooms.size) {
                return;
            }

            if (!rooms.has(path)) {
                rooms.set(path, { members: new Set(), messages: [] });
            }

            const room = rooms.get(path);
            joinedRooms.add(path);
            room.members.add(socket.id);
            const members = [...room.members];

            for (const member of members) {
                io.to(member).emit("user-joined", socket.id, members);
            }

            for (const { data, sender, socketId } of room.messages) {
                io.to(socket.id).emit("chat-message", data, sender, socketId);
            }
        });

        socket.on("signal", (toId, message) => {
            const [path] = joinedRooms;
            if (rooms.get(path)?.members.has(toId) && typeof message === "string") {
                io.to(toId).emit("signal", socket.id, message);
            }
        });

        socket.on("chat-message", (data, sender) => {
            const [path] = joinedRooms;
            const room = rooms.get(path);
            if (!room || typeof data !== "string" || data.length > 2000 || typeof sender !== "string" || sender.length > 100) {
                return;
            }

            if (room.messages.length >= 100) room.messages.shift();
            room.messages.push({ data, sender, socketId: socket.id });
            for (const member of room.members) {
                io.to(member).emit("chat-message", data, sender, socket.id);
            }
        });

        socket.on("disconnect", () => {
            for (const path of joinedRooms) {
                const room = rooms.get(path);
                room.members.delete(socket.id);
                if (room.members.size === 0) {
                    rooms.delete(path);
                } else {
                    for (const member of room.members) {
                        io.to(member).emit("user-left", socket.id);
                    }
                }
            }
            joinedRooms.clear();
        });
    });

    return io;
};
