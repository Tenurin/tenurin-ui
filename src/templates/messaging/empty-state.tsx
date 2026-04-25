export function MessagingEmptyState() {
  return (
    <div className="flex h-full w-full items-center justify-center px-6 py-12">
      <div className="flex max-w-xl flex-col items-center text-center">
        <div className="text-muted-foreground/75">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-80"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
        </div>
        <div className="mt-6">
          <h3 className="text-3xl font-normal tracking-[-0.04em] text-[var(--foreground)]">
            Your Messages
          </h3>
          <p className="mt-3 max-w-2xl text-base leading-8 text-muted-foreground">
            Select a conversation from the right rail to review the thread and
            reply from here.
          </p>
        </div>
      </div>
    </div>
  );
}
