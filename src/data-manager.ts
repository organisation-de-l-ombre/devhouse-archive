import * as RabbitMQ from 'amqp-ts';

export type Functions = {
    checkIfDataAvailable: (userId: string) => Promise<boolean> | boolean;
    provide: (userId: string) => Promise<Buffer> | Buffer;
};

/**
 * @description A DataManager class that communicates with the DataManager service.
 */
export class DataManager {
    private connection?: RabbitMQ.Connection;
    private queue?: RabbitMQ.Queue;
    private exchange?: RabbitMQ.Exchange;

    constructor(private readonly functions: Functions, private readonly serviceName: string, private readonly options: {
        amqp: string;
        exchange: string;
    } = {
        amqp: process.env.RABBITMQ_HOST as string,
        exchange: 'takeout_request'
    }) {}

    public async start () {
        this.connection = new RabbitMQ.Connection(this.options.amqp);
        this.queue = this.connection.declareQueue(this.serviceName);
        await this.queue.activateConsumer(this.onMessage.bind(this));
        this.exchange = this.connection.declareExchange(this.options.exchange);
        await this.queue.bind(this.exchange);
    }

    private async onMessage(message: RabbitMQ.Message) {
        const data: {
            userId: string;
            uuid: string;
        } = JSON.parse(message.content.toString());
        console.log(message.content.toString());
        // Uuid is the id of the bucket and userId is the id of the user.
        // We check if data is available.
        const exchange = this.connection?.declareExchange('takeout_callback', 'topic');
        if (exchange && await this.functions.checkIfDataAvailable(data.userId)) {
            // Status.
            let msg = new RabbitMQ.Message(JSON.stringify({
                uuid: data.uuid,
                status: 'found',
                name: this.serviceName,
            }));
            exchange.send(msg, 'takeout.callback.' + data.uuid);
            // TODO: Upload to s3.
            const returned = await this.functions.provide(data.userId);
            msg = new RabbitMQ.Message(JSON.stringify({
                uuid: data.uuid,
                status: 'finished',
                name: this.serviceName,
            }));
            exchange.send(msg, 'takeout.callback.' + data.uuid);
        }
    }
}
