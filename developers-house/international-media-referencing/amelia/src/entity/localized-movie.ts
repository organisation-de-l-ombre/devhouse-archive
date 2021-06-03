import { Entity, Index, Column, PrimaryColumn } from "typeorm";

@Entity()
@Index(["id", "language"], { unique: true })
export class LocalizedMovie {
  @PrimaryColumn()
  id!: string;

  @PrimaryColumn()
  language!: string;

  @Column()
  title!: string;

  @Column()
  releaseDate!: string;

  @Column()
  poster!: string;
}
