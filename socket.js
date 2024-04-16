let io;


// we are doing this so that we can use the socket connections anywhere in the backend
module.exports = {
    init: httpServer => {
       io= require('socket.io')(httpServer , {
        cors: {
            origin: "http://localhost:3000", // Allow requests from this origin
            methods: ["GET", "POST"] // Allow only GET and POST requests
          }
       });
       return io;
    },
    getIO: () => {

        if(!io) {
            throw new Error('Socket.io not initialized');
        }
        return io;   
    }
}