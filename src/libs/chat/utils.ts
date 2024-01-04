import {user_id} from "@/src/types/user-id.type";

export const getRoomId = (firstUserId: user_id, secondUserId: user_id) => {
    if (!firstUserId || !secondUserId || firstUserId === secondUserId) {
        return null;
    }

    const minUserId = firstUserId > secondUserId ? secondUserId : firstUserId;
    const maxUserId = firstUserId > secondUserId ? firstUserId : secondUserId;

    return `${minUserId}:${maxUserId}`;
}