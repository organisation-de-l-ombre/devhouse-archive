import {UserController} from "./controller/UserController";

type Route<T> = {
    method: 'post' | 'get' | 'put' | 'delete' | 'patch';
    route: string;
    action: keyof T;
    controller: new () => T;
};

type Routes<T> = Route<T>[];

export const Routes: Routes<UserController> = [{
    method: "post",
    route: "/api/users/create",
    controller: UserController,
    action: "create"
}, {
    method: "delete",
    route: "/api/users/:id",
    controller: UserController,
    action: "delete"
}, {
    method: "patch",
    route: "/api/users/:id",
    controller: UserController,
    action: "edit"
}, {
    method: "get",
    route: "/api/users/:id",
    controller: UserController,
    action: "get"
}, {
    method: "get",
    route: "/api/users/list",
    controller: UserController,
    action: "get"
}, {
    method: "post",
    route: "/api/users/login",
    controller: UserController,
    action: "initiateLogin",
}, {
    method: "put",
    route: "/api/users/login/push",
    controller: UserController,
    action: "pushLogin",
}];