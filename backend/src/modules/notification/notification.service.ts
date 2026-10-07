import { Injectable, MessageEvent } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { Repository } from 'typeorm';
import { filter, map, Observable, Subject } from 'rxjs';

export interface NotificationEvent {
  userId: number;
  type: string;
  payload?: unknown;
}

@Injectable()
export class NotificationService {
  private readonly eventSubject = new Subject<NotificationEvent>();

  constructor(
    @InjectRepository(Notification)
    private readonly notiRepository: Repository<Notification>,
  ) {}

  async getMyNotifications(userId: number) {
    const notifications = await this.notiRepository.find({
      where: {
        userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return notifications;
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notiRepository.update(
      {
        userId,
        isRead: false,
      },
      { isRead: true },
    );
  }

  notifyNewOrder(userId: number, notification: Notification) {
    this.eventSubject.next({
      userId,
      type: 'order:new',
      payload: notification,
    });
  }

  streamFor(userId: number): Observable<MessageEvent> {
    return this.eventSubject.asObservable().pipe(
      filter((e) => e.userId === userId),
      map((e) => ({ type: e.type, data: e.payload ?? {} })),
    );
  }
}
