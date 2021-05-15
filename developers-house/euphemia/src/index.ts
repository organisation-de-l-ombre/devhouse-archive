import "reflect-metadata"; // You need to import this first.
import { Client } from "@developers-house/nova-runtime";

// The client instance use the rabbitmq cluster to reteive events
// from the cache worker.
const client = new Client();

client.shard.getShards()
    .then(([shard0]) => {
        shard0.status;
    });

client.on("message", ({ content }) => { console.log(content); });

client.start();