/*
 * The main class of the program.
 */
import * as RabbitMQ from 'amqp-ts';
import {IService, TakeoutRequest} from "./types/service";
import {Payload, TakeoutPayload} from "./types/protocol";
import {S3_CLIENT} from "./s3";


/**
 * @description This class handles the connection between Cryir and the library.
 */
export class DataManager {
    private connection?: RabbitMQ.Connection;
    private queue?: RabbitMQ.Queue;
    private exchange?: RabbitMQ.Exchange;

    public services: IService[] = [];

    /**
     * Constructs the datamanager from the service name.
     */
    constructor(private readonly serviceName: string, private readonly options: {
        amqp: string;
        exchange: string;
    } = {
        amqp: process.env.RABBITMQ_HOST as string,
        exchange: 'takeout_request'
    }) {}

    /**
     * Starts the datamanager and listens for messages in cryir.
     * Note: This doesn't do anything is the environment is not production.
     */
    public async start () {
        if (process.env.NODE_ENV === "production") {
            this.connection = new RabbitMQ.Connection(this.options.amqp);
            this.queue = this.connection.declareQueue(this.serviceName);
            await this.queue.activateConsumer(this.onMessage.bind(this));
            this.exchange = this.connection.declareExchange(this.options.exchange);
            await this.queue.bind(this.exchange, 'cryir.takeout_request.create');
        } else {
            console.debug("[Datamanager] NOT started because the environment is not production.");
        }
    }

    private async onMessage(message: RabbitMQ.Message) {
        const data: Payload = JSON.parse(message.content.toString());

        const exchange = this.connection?.declareExchange('takeout_callback', 'topic');

        // Send that our service is ready!
        let msg = new RabbitMQ.Message(JSON.stringify({
            uuid: data.requestId,
            status: 'found',
            name: this.serviceName,
        }));
        exchange.send(msg, 'takeout.callback.' + data.requestId);

        if (data.type === "TAKEOUT") {
            // The requests is a takeout.
            const results = await Promise.all(this.services.map((service) => service.getUserData(data as TakeoutPayload)));
            const toUpload: TakeoutRequest = [];

            for (const result of results) {
                if (Array.isArray(result)) {
                    toUpload.push(...result);
                    continue;
                }
                toUpload.push(result);
            }

            const promises = toUpload.map((file) => (
                S3_CLIENT.upload({
                    Bucket: "takeouts",
                    Key: `${data.requestId}/${data.user}/${this.serviceName}/${file.file}`,
                    Body: file.data,
                    ContentLength: file.data instanceof Buffer ? file.data.length : undefined,
                }).promise()
            ));

            Promise.all(promises).then(() => {
                msg = new RabbitMQ.Message(JSON.stringify({
                    uuid: data.requestId,
                    status: 'finished',
                    name: this.serviceName,
                }));
                exchange.send(msg, 'takeout.callback.' + data.requestId);
                // Avoid the message requeue.
                message.ack();
            }).catch(console.error);

        }
    }
}
