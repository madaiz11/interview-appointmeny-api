import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession } from '../../entities/user-session.entity';

@Injectable()
export class UserSessionRepository {
  constructor(
    @InjectRepository(UserSession)
    private userSessionRepository: Repository<UserSession>,
  ) {}

  async createOrUpdateUserSession(userId: string): Promise<void> {
    const existingSession = await this.userSessionRepository.findOne({
      where: { userId },
    });

    if (existingSession) {
      await this.userSessionRepository.update(existingSession.id, {
        updatedAt: new Date(),
      });
    } else {
      const newSession = this.userSessionRepository.create({
        userId,
        isActive: true,
      });
      await this.userSessionRepository.save(newSession);
    }
  }

  async deactivateUserSession(userId: string): Promise<void> {
    await this.userSessionRepository.update(
      {
        userId,
      },
      { isActive: false },
    );
  }
}
