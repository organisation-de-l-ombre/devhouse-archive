import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  PrimaryColumn,
} from "typeorm";
import { Tag } from "./tag";
import { Company } from "./company";
import { Language } from "./language";

@Entity()
export class MovieTitle {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  poster!: string;

  @ManyToMany(() => Company)
  @JoinTable()
  companies!: Company[];

  @Column()
  releaseDate!: Date;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags!: Tag[];

  @ManyToMany(() => Language)
  @JoinTable()
  availableLanguages!: Language[];
}
