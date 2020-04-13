import {
  Column,
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  public static comment: string;

  @PrimaryGeneratedColumn()
  public id!: number;

  @CreateDateColumn({ comment: 'Creation date', type: 'timestamptz' })
  public createdAt!: Date;

  @Index()
  @UpdateDateColumn({ comment: 'Last update date', type: 'timestamptz' })
  public updatedAt!: Date;

  @Index()
  @Column('timestamptz', { comment: 'Deletion date', nullable: true })
  public deletedAt?: Date;
}
