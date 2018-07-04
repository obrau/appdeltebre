import { Role } from "./roles";

export class User {
    dni: string;
    email: string;
    key: string;
    name: string;
    password: string;
    repo: string;
    role: Role = Role.unauthorized;
}