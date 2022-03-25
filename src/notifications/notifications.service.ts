import { Injectable } from '@nestjs/common';
import { v1 as uuid } from 'uuid';
import { NotificationModal } from './notification.modal';

@Injectable()
export class NotificationsService {
  private notifications: NotificationModal[] = [
    {
      notificationId: uuid(),
      picture:
        'https://images.unsplash.com/photo-1640622308069-4352d9b4dcc8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80%22',
      time: new Date(),
      content: 'This is content',
    },
    {
      notificationId: uuid(),
      picture:
        'https://images.unsplash.com/photo-1640622308069-4352d9b4dcc8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80%22',
      time: new Date(),
      content: 'This is content',
    },
    {
      notificationId: uuid(),
      picture:
        'https://images.unsplash.com/photo-1640622308069-4352d9b4dcc8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80%22',
      time: new Date(),
      content: 'This is content',
    },
    {
      notificationId: uuid(),
      picture:
        'https://images.unsplash.com/photo-1640622308069-4352d9b4dcc8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80%22',
      time: new Date(),
      content: 'This is content',
    },
  ];

  getNotifications(): NotificationModal[] {
    return this.notifications;
  }
}
