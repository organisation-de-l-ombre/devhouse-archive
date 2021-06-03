import { Entity, Column, ManyToMany, JoinTable, PrimaryColumn } from "typeorm";
import { Tag } from "./tag";
import { Company } from "./company";
import { LocalizedMovie } from "./localized-movie";

@Entity()
export class MovieTitle {
  @PrimaryColumn()
  id!: string;

  @Column()
  title!: string;

  @ManyToMany(() => Company)
  @JoinTable()
  companies!: Company[];

  @Column()
  releaseDate!: Date;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags!: Tag[];

  @ManyToMany(() => LocalizedMovie)
  @JoinTable()
  localizedInformation!: LocalizedMovie[];
}
