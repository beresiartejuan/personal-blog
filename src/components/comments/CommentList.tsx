import { useState, useEffect, useCallback } from "preact/hooks";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { getAnonymousId } from "@/lib/visitor";
import { actions } from "astro:actions";
import type { Comment } from "@/db/schema";
import "./CommentList.css";

interface CommentListProps {
  postSlug: string;
}

interface CommentWithOwn extends Comment {
  isOwn: boolean;
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function EmptyState() {
  return (
    <div className="comment-empty-state">
      <div className="comment-empty-icon">💭</div>
      <p className="comment-empty-title">Silencio por ahora</p>
      <p className="comment-empty-hint">Sé el primero en romperlo</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="comment-loading-state">
      <div className="comment-spinner" />
      <span>Cargando conversación...</span>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="comment-error-state">
      <p>No se pudieron cargar los comentarios</p>
      <button onClick={onRetry} className="comment-retry-btn">
        Intentar de nuevo
      </button>
    </div>
  );
}

function CommentItem({ comment, index }: { comment: CommentWithOwn; index: number }) {
  const date = new Date(comment.createdAt);
  const timeAgo = formatDistanceToNow(date, { addSuffix: false, locale: es });
  const avatarUrl = `https://api.dicebear.com/10.x/lorelei-neutral/svg?seed=${encodeURIComponent(comment.anonymousId)}`;
  
  return (
    <article
      className={`comment-scene ${comment.isOwn ? 'comment-own' : ''}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="comment-block">
        {/* Avatar */}
        <div className="comment-avatar-slot">
          <div className={`comment-avatar-ring ${comment.isOwn ? 'comment-avatar-ring-own' : ''}`} />
          <div className="comment-avatar-frame">
            <div className="comment-avatar-placeholder" />
            <img
              src={avatarUrl}
              alt=""
              loading="lazy"
              className="comment-avatar-img"
              onLoad={(e) => e.currentTarget.classList.add("loaded")}
            />
          </div>
        </div>

        {/* Content */}
        <div className="comment-content-area">
          <p className="comment-voice"
            dangerouslySetInnerHTML={{ __html: escapeHtml(comment.content) }}
          />
          
          <div className="comment-identity">
            {comment.isOwn ? (
              <span className="comment-badge comment-badge-you">Tú</span>
            ) : (
              <span className="comment-author-mark">
                {escapeHtml(comment.authorName || "Anónimo")}
              </span>
            )}
            <span className="comment-separator">·</span>
            <time className="comment-time-mark" title={date.toLocaleString("es-ES")}>
              {timeAgo}
            </time>
            {comment.isFlagged && (
              <span className="comment-badge comment-badge-flagged">Censurado</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CommentList({ postSlug }: CommentListProps) {
  const [comments, setComments] = useState<CommentWithOwn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentId, setCurrentId] = useState("");

  // Obtener el ID del usuario en el cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentId(getAnonymousId());
    }
  }, []);

  const loadComments = useCallback(async () => {
    if (!currentId) return;
    
    setLoading(true);
    setError(false);
    
    try {
      const { data } = await actions.getComments({ postSlug });
      const fetchedComments = data?.comments || [];
      
      const commentsWithOwn = fetchedComments.map((comment: Comment) => ({
        ...comment,
        isOwn: comment.anonymousId === currentId,
      }));
      
      setComments(commentsWithOwn);
    } catch (err) {
      console.error("Error loading comments:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [postSlug, currentId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Escuchar evento de nuevo comentario
  useEffect(() => {
    const handleCommentSubmitted = () => {
      loadComments();
    };

    window.addEventListener("comment-submitted", handleCommentSubmitted);
    return () => {
      window.removeEventListener("comment-submitted", handleCommentSubmitted);
    };
  }, [loadComments]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRetry={loadComments} />;
  }

  if (comments.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="comments-stage">
      {comments.map((comment, index) => (
        <CommentItem key={comment.id} comment={comment} index={index} />
      ))}
    </div>
  );
}
