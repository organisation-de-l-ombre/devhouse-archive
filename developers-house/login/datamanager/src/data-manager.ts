import { IService, WithName } from "./types/service";
import { RabbitMQConnection } from "./protocol/rabbitmq";
import { DeletePayload, Payload, TakeoutPayload } from "./types/protocol";
import { S3_CLIENT } from "./s3";
import { Stream } from "stream";

/**
 * @description This class handles the connection between Cryir and the library.
 */
export class DataManager {
  private services: IService[] = [];
  private conn?: RabbitMQConnection;

  /**
   * Constructs the datamanager from the service name.
   *
   * @param {string} programName The name of the current program.
   * @param {string} amqp Optional url of rabbitmq.
   */
  constructor(
    private readonly programName: string,
    private readonly amqp: string = process.env.DATAMANAGER_RABBITMQ_HOST || ""
  ) {}

  /**
   * Starts the datamanager and listens for messages in cryir.
   * Note: This doesn't do anything is the environment is not production.
   */
  public start(): void {
    if (process.env.NODE_ENV === "production") {
      this.conn = new RabbitMQConnection("", this.programName);
      this.conn.onTakeout = async (...a) => await this.onTakeout(...a);
      this.conn.onDelete = async (...a) => await this.onDelete(...a);
    } else {
      console.debug(
        "[Datamanager] NOT started because the environment is not production."
      );
    }
  }

  private async onTakeout(data: Payload) {
    const services = (
      await Promise.all(
        this.services.map(
          async (s) => await s.getUserData(data as TakeoutPayload)
        )
      )
    ).filter((a) => a !== null);
    const files: WithName<Buffer | Stream>[] = [];
    void services.map((d) => {
      if (Array.isArray(d)) {
        files.push(...d);
      } else {
        files.push(d);
      }
    });

    const sendTasks = files.map((file) =>
      S3_CLIENT.upload({
        Bucket: "takeouts",
        Key: `${data.requestId}/${data.user}/${this.programName}/${file.file}`,
        Body: file.data,
        ContentLength:
          file.data instanceof Buffer ? file.data.length : undefined
      })
    );
    await Promise.all(sendTasks);
  }

  private async onDelete(data: Payload) {
    await Promise.all(
      this.services.map(
        async (s) => await s.deleteUserData(data as DeletePayload)
      )
    );
  }

  private register<T extends IService>(service: T): this {
    this.services.push(service);
    return this;
  }
}
