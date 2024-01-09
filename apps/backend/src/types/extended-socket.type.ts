import {Socket} from "socket.io";
import {UserSessionDto} from "@/src/libs/security/src/dtos/UserSessionDto";

export interface ExtendedSocketType extends Socket {
    user: UserSessionDto;
}