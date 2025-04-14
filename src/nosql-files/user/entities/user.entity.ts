import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity('user')
@Unique(['username', "email"])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30 })
    first_name: string;

    @Column({ length: 30 })s
    last_name: string;

    @Column({ length: 30, unique: true })
    username: string;

    @Column({ length: 100, unique: true })
    email: string;

    @Column({ length: 10 })
    mobile: string;

    @Column({ nullable: false })
    password: string;

    @Column({ unique: true })
    code: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
