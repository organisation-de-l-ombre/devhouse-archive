import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  language!: string;
}
