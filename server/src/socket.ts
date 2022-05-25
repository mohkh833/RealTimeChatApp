import {nanoid} from "nanoid"
import {Server, Socket} from "socket.io";
import logger from "./utilis/logger";

const EVENTS = {
    connection: 'connection',
    CLIENT:{
        CREATE_ROOM: "CREATE_ROOM",
        SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
        JOIN_ROOM:"JOIN_ROOM",
    },
    SERVER:{
        ROOMS: "ROOMS",
        JOINED_ROOM: 'JOINED_ROOM',
        ROOM_MESSAGE: 'ROOM_MESSAGE'
    }
}

const rooms: Record<string, {name: string}> = {}

const socket =({io}: {io: Server}) => {
    logger.info(`socket enabled`);

    io.on(EVENTS.connection, (socket:Socket)=> {
        logger.info(`user connected ${socket.id}`)

        socket.emit(EVENTS.SERVER.ROOMS, rooms)

        /*when a user create a new room */
        socket.on(EVENTS.CLIENT.CREATE_ROOM, ({roomName}) =>{
            // create a roomId
            const roomId = nanoid()

            //add a new room to the rooms object
            rooms[roomId] = {
                name:roomName
            }

            //socket join(roomId)
            socket.join(roomId)

            //broadcst an event there is a new room
            socket.broadcast.emit(EVENTS.SERVER.ROOMS,rooms)
            // emit back to the room creator all the rooms
            socket.emit(EVENTS.SERVER.ROOMS,rooms)
            //emit event back to the room creator saying they have joined a room
            socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId)
        })

        /* when a user send a room message */

        socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE,
            ({roomId, message, username})=>{
                const date = new Date()

                socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
                    message,
                    username,
                    time: `${date.getHours()}:${date.getMinutes()}`
                })
        })


        /*when a user join room */
        socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
            socket.join(roomId)
            socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId)
        })
    })
}


export default socket