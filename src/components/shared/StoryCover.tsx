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
  alt,
}: {
  article: Pick<NewsArticle, "id" | "imageUrl" | "category" | "severity"> & { title?: string };
  className?: string;
  imgClassName?: string;
  showCode?: boolean;
  width?: number;
  alt?: string;
}) {
  const raw = article.imageUrl || categoryImage(article.category, article.id, width);
  // Request an appropriately sized file from Unsplash for small thumbnails.
  const src = raw.includes("images.unsplash.com") ? raw.replace(/([?&])w=\d+/, `$1w=${width}`) : raw;
  const imageAlt = alt !== undefined ? alt : (article.title ? `${article.title} - MENA Cyber Wire` : "");

  return (
    <div className={`relative overflow-hidden bg-paper-sunk ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={imageAlt}
        loading="lazy"
        className={`h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.04] ${imgClassName}`}
      />
    </div>
  );
}
