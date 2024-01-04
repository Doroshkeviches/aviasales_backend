import { User } from "@prisma/client";

/* TODO: make this type not only matchable for users, but also for any other instances
 *   instead, create an uuid type
 */
export type user_id = Pick<User, "id">;