import { MessageCircle } from 'lucide-react';

export function MessagingEmptyState() {
  return (
    <div className="flex h-full w-full items-center justify-center px-6 py-12">
      <section className="flex max-w-sm flex-col items-center text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-border/70 bg-sidebar text-muted-foreground">
          <MessageCircle className="h-5 w-5" />
        </div>

        <h3 className="mt-5 text-2xl font-medium text-[var(--foreground)]">
          Your Messages
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Select a conversation from the rail to review the thread and reply
          from here.
        </p>
      </section>
    </div>
  );
}
