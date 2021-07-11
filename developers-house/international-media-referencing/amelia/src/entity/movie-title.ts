import { Entity, Column, ManyToMany, JoinTable, PrimaryColumn } from "typeorm";
import { Company } from "./company";
import { Tag } from "./tag";
import { LocalizedMovie } from "./localized-movie";

@Entity()
export class MovieTitle {
  @PrimaryColumn()
  id!: string;

  @Column({ name: "internationalTitle" })
  title!: string;

  @Column({ name: "internationalReleaseDate" })
  releaseDate?: Date;

  @Column()
  originalCountry!: string;

  @Column({ nullable: true })
  duration?: number;

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
