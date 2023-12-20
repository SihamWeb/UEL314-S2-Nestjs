import { Table, Column, Model, AutoIncrement, PrimaryKey } from 'sequelize-typescript';

@Table
export class User extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Column
  firstname: string;

  @Column
  lastname: string;
}
