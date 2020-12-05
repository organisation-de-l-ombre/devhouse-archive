import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {User} from "./User";

/*
 * Represents a link to an external account in the database.
 */
@Entity()
export class Link {
    /*
     * The unique identifier of the user.
     */
    @PrimaryGeneratedColumn('uuid')
    uuid: number;

    /*
     * The username of the user
     */
    @Column()
    platform: 'discord' | 'google' | 'instagram' | 'github';

    /*
     * Is the account of the user a public account ?
     */
    @Column()
    platformId: string;

    @ManyToOne(() => User, user => user.links, { cascade: true, onDelete: "CASCADE" })
    user: User;

    // TODO: Updated ad and created at.
}
