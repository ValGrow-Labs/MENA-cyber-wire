"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ArticleEditorForm from "@/components/cms/ArticleEditorForm";
import { CMSArticle } from "@/types/cms";

export default function EditArticlePage() {
  const params = useParams();
  const id = params?.id as string;
  const [article, setArticle] = useState<CMSArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/cms/articles/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setArticle(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-xs text-[#707070]">
        Loading article data from repository...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-8 text-center text-xs text-[#707070]">
        Article not found. It may have been deleted or moved.
      </div>
    );
  }

  return <ArticleEditorForm initialArticle={article} isNew={false} />;
}
