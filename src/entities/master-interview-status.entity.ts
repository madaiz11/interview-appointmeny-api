import { MasterInterviewStatusCode } from 'src/shared/enum/master/interview-status-code.enum';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('master_interview_status')
export class MasterInterviewStatus {
  @PrimaryColumn({
    type: 'varchar2',
    length: 5,
  })
  code: MasterInterviewStatusCode;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;
}
