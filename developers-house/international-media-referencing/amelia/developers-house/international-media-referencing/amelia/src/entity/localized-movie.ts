import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class LocalizedMovie {
  @PrimaryColumn()
  id!: string;

  @Column()
  language!: string;

  @Column()
  title!: string;

  @Column()
  releaseDate?: Date;

  @Column({ nullable: true })
  background?: string;

  @Column({ nullable: true })
  poster?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  quotation?: string;

  @Column({ nullable: true })
  trailer?: string;

  @Column()
  firstAdd!: Date;

  @Column("timestamp", { name: "lastModification" })
  lastEdit!: Date;
}
