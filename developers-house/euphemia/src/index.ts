import "reflect-metadata"; // You need to import this first.
import { Client, Message } from "@developers-house/nova-runtime";
import { blue, gray } from "chalk";

const password = process.env.PASSWORD;

// The client instance use the rabbitmq cluster to reteive events
// from the cache worker.
const client = new Client({ 
    amqpUrl: "amqp://nova_euphemia:" + password + "@localhost:5672/nova_euphemia",
    restRPCClientOptions: { endpoint: "" }
});

declare module "@developers-house/nova-runtime" {
    export interface EventNames {
        "message.create": Message;
    }
}

client.on("message.create", (t) => {
    // @ts-ignore
    if (t.data.author.bot) return;
    // @ts-ignore
    console.log(blue(`${t.data.author.username} via ${t.tracing.node_name}: `) + gray(t.data.content.substr(0, 45) + (t.data.content.length > 45 ? "...": "")));
});

client.start();