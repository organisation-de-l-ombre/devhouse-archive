import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne} from "typeorm";
import {Link} from "./Link";
import {TwoFA} from "./TwoFA";

/*
 * Represents a user in the database
 */
@Entity()
export class User {
    /*
     * The unique identifier of the user.
     */
    @PrimaryGeneratedColumn('uuid')
    uuid: number;

    /*
     * The username of the user
     */
    @Column()
    username: string;

    /*
     * Is the account of the user a public account ?
     */
    @Column()
    private: boolean = false;

    /*
     * The flags of the user (roles)
     * 0x0 = Member
     * 0x1 = Administrator
     * 0x2 = Moderator
     * 0x3 = Developers
     * 0x4 = Reporter
     */
    @Column()
    roles: number;

    /*
     * The avatar hash of the user stored in the s3 bucket.
     */
    @Column()
    avatar: string;

    /*
     * Data collection settings,
     * should we disable all the trackers for this user.
     * Including all the external services such as Sentry, GA et GTM
     */
    @Column()
    dataCollection: boolean;

    /*
     * Is the user a premium user of the platform.
     */
    @Column()
    premium: boolean;

    /*
     * The ban reason of the user (may be null if no banned)
     */
    @Column({ nullable: true })
    ban?: string;

    /*
     * The list of accounts related to this user.
     */
    @OneToMany(() => Link, link => link.user)
    links: Link[];

    /*
     * A two fa account
     */
    @OneToOne(() => TwoFA, twoFa => twoFa.user,  { nullable: true })
    twoFactor?: TwoFA;

    // TODO: Updated ad and created at.
}
