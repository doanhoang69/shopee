import {
  Controller,
  Get,
  Patch,
  Sse,
  UseGuards,
  MessageEvent,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../auth/auth.guard';
import { Authorized } from '../../shared/decorators/authorized.decorator';
import { interval, map, merge, Observable, takeUntil, timer } from 'rxjs';

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getMyNotifications(@Authorized() userId: number) {
    return this.notificationService.getMyNotifications(userId);
  }

  @Patch('read-all')
  markAllAsRead(@Authorized() userId: number) {
    return this.notificationService.markAllAsRead(userId);
  }

  @Sse('sse')
  sse(@Authorized() userId: number): Observable<MessageEvent> {
    const heartbeat$ = interval(15000).pipe(
      map(() => ({ type: 'ping', data: {} }) as MessageEvent),
    );

    return merge(this.notificationService.streamFor(userId), heartbeat$).pipe(
      takeUntil(timer(15 * 60 * 1000)), // đóng đúng bằng thời hạn accessToken
    );
  }
}
