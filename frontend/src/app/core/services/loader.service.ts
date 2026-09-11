import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private readonly pageRequests = signal(0);
  private readonly activeSenders = signal<ReadonlyMap<string, number>>(new Map());

  readonly isPageLoading = computed(() => this.pageRequests() > 0);

  isLoading(sender: string): boolean {
    return (this.activeSenders().get(sender) ?? 0) > 0;
  }

  start(sender?: string): void {
    if (sender) {
      this.activeSenders.update((senders) => {
        const nextSenders = new Map(senders);
        nextSenders.set(sender, (nextSenders.get(sender) ?? 0) + 1);
        return nextSenders;
      });
      return;
    }

    this.pageRequests.update((requests) => requests + 1);
  }

  stop(sender?: string): void {
    if (sender) {
      this.activeSenders.update((senders) => {
        const nextSenders = new Map(senders);
        const requests = (nextSenders.get(sender) ?? 0) - 1;
        if (requests > 0) {
          nextSenders.set(sender, requests);
        } else {
          nextSenders.delete(sender);
        }
        return nextSenders;
      });
      return;
    }

    this.pageRequests.update((requests) => Math.max(0, requests - 1));
  }
}
