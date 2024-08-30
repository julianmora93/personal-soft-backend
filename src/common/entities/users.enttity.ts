import { UserStatusEntity } from "./user.status.entity";

export interface UserEntity {
    id: number;
    username: string;
    role: string;
    status: UserStatusEntity;
}