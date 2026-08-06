let ioInstance;

export const initSocket = (io) => {
  ioInstance = io;
};

export const getIO = () => {
    if (!ioInstance) {
        throw new Error("Socket.io has not been initialized yet.");
    }
    return ioInstance;
}