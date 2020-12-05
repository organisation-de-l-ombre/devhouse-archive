import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";
import {User} from "./User";

/*
 * Represents a 2FA enabled account.
 */
@Entity()
export class TwoFA {
    /*
     * The unique identifier of the user.
     */
    @PrimaryGeneratedColumn('uuid')
    uuid: number;

    /*
     * The user related to this 2Fa account.
     */
    @OneToOne(() => User, user => user.twoFactor, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn()
    user: User;

    /*
     * The secret key of the 2FA account.
     */
    @Column()
    secret: string;

    // TODO: Updated ad and created at.
}
