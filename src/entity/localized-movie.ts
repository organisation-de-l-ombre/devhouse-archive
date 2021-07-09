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
  releaseDate!: Date;

  @Column()
  poster!: string;

  @Column()
  description!: string;

  @Column()
  firstAdd!: Date;

  @Column()
  lastModification!: Date;
}
