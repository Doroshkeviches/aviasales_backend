import { Device, User } from "@prisma/client";

export type decoded_user = Pick<User, 'id' | 'email' | 'role_id'> & Pick<Device, 'device_id'>

// TODO: fix merge conflicts in files above and remove this comment before commit