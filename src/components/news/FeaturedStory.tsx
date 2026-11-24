import Link from "next/link";
import { NewsArticle } from "@/types/news";
import ThreatSeverityBadge from "@/components/shared/ThreatSeverityBadge";
import VerificationBadge from "@/components/shared/VerificationBadge";

interface Props {
  article: NewsArticle;
}

/** Front-page lead: large serif headline, dek, optional photo, then key points. */
export default function FeaturedStory({ article }: Props) {
  if (!article) return null;

  const date = new Date(article.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const ta = article.threatToAction;

  return (
    <article className="animate-rise">
      <div className={article.imageUrl ? "grid gap-6 md:grid-cols-12 md:gap-8" : ""}>
        <div className={article.imageUrl ? "md:col-span-7" : ""}>
          <p className="kicker flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-signal">Lead story</span>
            {article.country && <span>{article.country}</span>}
            <span>{article.category}</span>
          </p>

          <Link href={`/article/${article.id}`} className="group block">
            <h1 className="mt-3 font-serif text-[2.125rem] font-semibold leading-[1.04] tracking-[-0.025em] text-ink sm:text-5xl lg:text-[3.75rem]">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                {article.title}
              </span>
            </h1>
          </Link>

          <p className="mt-4 max-w-prose font-serif text-lg leading-relaxed text-ink-2 sm:text-xl">
            {article.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-3">
            <span className="font-medium text-ink">{article.sourceName}</span>
            <time className="text-xs font-medium tabular" dateTime={article.publishedAt}>
              {date}
            </time>
            {article.readTime && <span className="text-xs font-medium">{article.readTime}</span>}
            <ThreatSeverityBadge severity={article.severity} />
            <VerificationBadge status={article.verificationStatus} />
          </div>
        </div>

        {article.imageUrl && (
          <Link href={`/article/${article.id}`} className="group block md:col-span-5" tabIndex={-1}>
            <figure className="overflow-hidden bg-paper-sunk">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={`${article.title} - ${article.country || "MENA"} cyber threat report`}
                loading="eager"
                className="aspect-[4/3] w-full object-cover grayscale-[35%] transition duration-700 group-hover:scale-[1.02] group-hover:grayscale-0"
              />
            </figure>
          </Link>
        )}
      </div>

      {ta && (
        <div className="mt-10 grid border-t border-edge sm:grid-cols-3">
          {[
            { label: "Why it matters", body: ta.whyItMatters },
            { label: "Who is affected", body: ta.whoIsAffected },
            { label: "What to do", body: ta.whatShouldUsersDo },
          ].map((c, i) => (
            <div
              key={c.label}
              className={`py-4 sm:pr-5 ${i > 0 ? "border-t border-rule sm:border-l sm:border-t-0 sm:pl-5" : ""}`}
            >
              <p className="kicker text-ink">{c.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-2 line-clamp-4">{c.body}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-5 border-t border-rule pt-4">
        <Link href={`/article/${article.id}`} className="btn-primary">
          Read the full story
        </Link>
        <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="link text-sm text-ink-2">
          Primary source ↗
        </a>
      </div>
    </article>
  );
}
