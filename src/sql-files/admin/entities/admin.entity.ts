import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('admin')
@Index(['username', 'email'], { unique: true })
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30 })
    first_name: string;

    @Column({ length: 30 })
    last_name: string;

    @Column({ length: 30,unique:true })
    username: string;

    @Column({ length: 100 })
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
