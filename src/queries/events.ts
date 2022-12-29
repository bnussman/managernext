import { getEvents, Event, markEventSeen } from "@linode/api-v4";
import { ResourcePage } from "@linode/api-v4/lib/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { queryClient } from "../App";

const queryKey = 'events';

export const useEventsPollingQuery = () =>
  useQuery<ResourcePage<Event>, AxiosError>(
    [queryKey, "polling"],
    () => getEvents({ page_size: 100 }, { seen: false }),
    {
      refetchInterval: 5000,
      retryDelay: 5000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      async onSuccess(data) {
        eventHandler(data.data);
        for (const event of data.data.filter(event => !event.seen && !['scheduled', 'started'].includes(event.status))) {
          await markEventSeen(event.id);
        }
      },
    }
  );

function eventHandler(events: Event[]) {
  for (const event of events) {
    if (!event.entity) {
      continue;
    }

    console.log(`[Events] Invalidating ${event.entity.type} ${event.entity.id} and associated paginated store.`)

    queryClient.invalidateQueries([event.entity.type, event.entity.id]);
    queryClient.invalidateQueries([event.entity.type, "paginated"]);
  }
}