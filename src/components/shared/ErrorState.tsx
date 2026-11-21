interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = "The feed didn't load.", onRetry }: Props) {
  return (
    <div role="alert" className="my-6 rounded-3xl border border-signal/25 bg-signal-wash/40 px-6 py-6">
      <p className="kicker text-signal">Feed unavailable</p>
      <p className="mt-2 font-serif text-lg text-ink">{message}</p>
      <p className="mt-1 max-w-prose text-sm text-ink-3">
        Public RSS and NVD endpoints rate-limit aggressively. Waiting a minute usually fixes it.
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-quiet mt-4">
          Try again
        </button>
      )}
    </div>
  );
}
