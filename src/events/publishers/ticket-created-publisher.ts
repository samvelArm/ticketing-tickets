import { Publisher } from '@samvel-ticketing/common';
import { TicketCreatedEvent } from '@samvel-ticketing/common';
import { Subjects } from '@samvel-ticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
