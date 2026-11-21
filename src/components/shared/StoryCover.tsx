import { NewsArticle } from "@/types/news";
import { categoryImage } from "@/lib/media/category-images";

/**
 * Story image. Stories without their own photo get an illustrative photo
 * chosen by category (stable per story), so every card has imagery.
 */
export default function StoryCover({
  article,
  className = "",
  imgClassName = "",
  width = 1200,
}: {
  article: Pick<NewsArticle, "id" | "imageUrl" | "category" | "severity">;
  className?: string;
  imgClassName?: string;
  showCode?: boolean;
  width?: number;
}) {
  const raw = article.imageUrl || categoryImage(article.category, article.id, width);
  // Request an appropriately sized file from Unsplash for small thumbnails.
  const src = raw.includes("images.unsplash.com") ? raw.replace(/([?&])w=\d+/, `$1w=${width}`) : raw;

  return (
    <div className={`relative overflow-hidden bg-paper-sunk ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        className={`h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.04] ${imgClassName}`}
      />
    </div>
  );
}
