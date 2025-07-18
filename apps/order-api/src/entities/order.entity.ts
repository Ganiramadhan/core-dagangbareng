import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Shop } from '../../../shop-api/src/entities/shop.entity';
import { OrderItem } from './order-item.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'shop_id', type: 'int', nullable: false })
  shopId: number;

  @Column({
    name: 'customer_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  customerName: string;

  @Column({
    name: 'customer_phone',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  customerPhone: string;

  @Column({ name: 'customer_address', type: 'text', nullable: false })
  customerAddress: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  // 👇 Relasi ke Shop
  @ManyToOne(() => Shop, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  // 👇 Relasi ke OrderItem
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
