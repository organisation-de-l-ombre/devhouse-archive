import * as RabbitMQ from 'amqp-ts';
import S3 from 'aws-sdk/clients/s3';

export type Functions = {
    checkIfDataAvailable: (userId: string) => Promise<boolean> | boolean;
    provide: (userId: string) => Promise<({ name: string; data: Buffer })[]>;
};

const S3client = new S3({
    credentials: {
        accessKeyId: process.env.TAKEOUT_AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.TAKEOUT_AWS_SECRET_ACCESS_KEY as string
    },
    endpoint: 'http://' + process.env.TAKEOUT_BUCKET_HOST + ':' + process.env.TAKEOUT_BUCKET_PORT,
    s3ForcePathStyle: true
});


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
        await this.queue.bind(this.exchange, 'cryir.takeout_request.create');
    }

    private async onMessage(message: RabbitMQ.Message) {
        const data: {
            user: string;
            uuid: string;
        } = JSON.parse(message.content.toString());
        console.log(message.content.toString());
        // Uuid is the id of the bucket and userId is the id of the user.
        // We check if data is available.
        const exchange = this.connection?.declareExchange('takeout_callback', 'topic');
        if (exchange && await this.functions.checkIfDataAvailable(data.user)) {
            // Status.
            let msg = new RabbitMQ.Message(JSON.stringify({
                uuid: data.uuid,
                status: 'found',
                name: this.serviceName,
            }));
            exchange.send(msg, 'takeout.callback.' + data.uuid);
            const returned = await this.functions.provide(data.user);
            const promises = returned.map((file) => (
                S3client.upload({
                    Bucket: "takeouts",
                    Key: `${data.uuid}/${data.user}/${this.serviceName}/${file.name}`,
                    Body: file.data,
                    ContentLength: file.data.length,
                }).promise()
            ));
            Promise.all(promises).then(() => {
                msg = new RabbitMQ.Message(JSON.stringify({
                    uuid: data.uuid,
                    status: 'finished',
                    name: this.serviceName,
                }));
                exchange.send(msg, 'takeout.callback.' + data.uuid);
                // Avoid the message requeue.
                message.ack();
            }).catch(console.log);
        }
    }
}
