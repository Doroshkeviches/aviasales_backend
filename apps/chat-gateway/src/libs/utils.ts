import {User} from "@prisma/client";

export const getRoomId = (firstUserId: Pick<User, 'id'>, secondUserId: Pick<User, 'id'>) => {
    const firstId = firstUserId.id;
    const secondId = secondUserId.id;

    if (!firstId || !secondUserId || firstId === secondId) {
        return null;
    }

    const minUserId = firstId > secondId ? secondId : firstId;
    const maxUserId = firstId > secondId ? firstId : secondId;

    return `${minUserId}:${maxUserId}`;
}