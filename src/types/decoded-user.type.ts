import { User } from "@prisma/client";

export type decoded_user = Pick<User, 'id' | 'email' | 'role_type'>