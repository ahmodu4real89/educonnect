import { BreadRepository } from "@/app/lib/helpers";
import prisma from "@/app/lib/prisma";
import { Notification } from "@prisma/client";

class NotificationRepository extends BreadRepository<Notification> {
  constructor() {
    super(prisma.notification);
  }

}

const notificationRepo = new NotificationRepository()

export default notificationRepo