import * as RabbitMQ from "amqp-ts";
import { CALLBACK_EXCHANGE_NAME, REQUEST_EXCHANGE_NAME } from "./constants";
import { Payload } from "../types/protocol";

export class RabbitMQConnection {
  private connection: RabbitMQ.Connection;
  private readonly queue: RabbitMQ.Queue;
  private readonly exchange: RabbitMQ.Exchange;
  private readonly callback: RabbitMQ.Exchange;

  public onTakeout?: (request: Payload) => Promise<void>;
  public onDelete?: (request: Payload) => Promise<void>;

  /**
   * Creates a rabbitmq connection dedicated to datamanager.
   *
   * @param {string} url The amqp url of the server
   * @param {string} programName The name of the current service.
   */
  constructor(url: string, private programName: string) {
    this.connection = new RabbitMQ.Connection(url);
    // Create a queue to receive data.
    this.queue = this.connection.declareQueue(`data_manager_${programName}`, {
      durable: true,
      exclusive: false
    });

    this.exchange = this.connection?.declareExchange(REQUEST_EXCHANGE_NAME);
    this.callback = this.connection?.declareExchange(
      CALLBACK_EXCHANGE_NAME,
      "topic"
    );

    if (!this.queue) {
      console.error("Datamanager: The service queue doesn't exists.");
      return;
    }
    if (!this.exchange || !this.callback) {
      console.error(
        "Datamanager: Couldn't register the queue, the exchange doesn't exists on this server."
      );
      return;
    }

    // Listen for requests.
    this.queue
      .activateConsumer(this.onMessage.bind(this))
      .then(() => {
        // Once we are listening
        // We try to register our queue to the request exchange.
        this.queue?.bind(this.exchange, "cryir.takeout_request.create");

        return 0;
      })
      .catch(() => {
        console.error("Datamanager: Failed to start");
      });
  }

  /**
   * Updates the status of a takeout request.
   *
   * @param {string} id The is of the takeout request.
   * @param {string} status The new status for the service.
   * @private
   */
  private updateStatus(id: string, status: string) {
    const message = new RabbitMQ.Message(
      JSON.stringify({
        uuid: id,
        status: status,
        name: this.programName
      })
    );
    this.callback.send(message, `takeout.callback.${id}`);
  }

  /**
   * This method is called when a message is received form the rabbitmq channel.
   *
   * @param {RabbitMQ.Message} raw The message received.
   * @private
   */
  private async onMessage(raw: RabbitMQ.Message) {
    const data = JSON.parse(raw.content.toString()) as Payload;

    // Notify Cryir that we are handling the data.
    this.updateStatus(data.requestId, "pending");
    let failed = false;
    switch (data.type) {
      case "DELETE":
        if (this.onDelete) {
          await this.onDelete(data).catch(() => {
            failed = true;
            this.updateStatus(data.requestId, "failed");
          });
        }
        break;
      case "TAKEOUT":
        if (this.onTakeout) {
          await this.onTakeout(data).catch(() => {
            failed = true;
            this.updateStatus(data.requestId, "failed");
          });
        }
        break;
    }

    if (!failed) {
      this.updateStatus(data.requestId, "finished");
    }
  }
}
