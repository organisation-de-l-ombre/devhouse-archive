import { Entity, Column, ManyToMany, JoinTable, PrimaryColumn } from "typeorm";
import { Company } from "./company";
import { Tag } from "./tag";
import { LocalizedMovie } from "./localized-movie";

@Entity()
export class MovieTitle {
  @PrimaryColumn()
  id!: string;

  @Column()
  internationalTitle!: string;

  @Column()
  internationalReleaseDate!: Date;

  @Column()
  originalCountry!: string;

  @ManyToMany(() => Company)
  @JoinTable()
  companies!: Company[];

  @Column()
  case!: string;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags!: Tag[];

  @ManyToMany(() => LocalizedMovie)
  @JoinTable()
  localizedInformation!: LocalizedMovie[];
}
