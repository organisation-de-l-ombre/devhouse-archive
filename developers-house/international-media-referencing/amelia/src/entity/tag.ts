import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  name!: string;
}
