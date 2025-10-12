import { Publisher } from '@samvel-ticketing/common';
import { TicketUpdatedEvent } from '@samvel-ticketing/common';
import { Subjects } from '@samvel-ticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
