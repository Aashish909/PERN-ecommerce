

import { useState } from "react";
import { Star, User, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { postProductReview, deleteReview } from "../../store/slices/productSlice";

const ReviewsContainer = ({ reviews = [], productId }) => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { isPostingReview, isReviewDeleting } = useSelector((state) => state.product);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) {
      toast.error("Please login to post a review");
      return;
    }
    const result = await dispatch(postProductReview({ productId, rating, comment }));
    if (postProductReview.fulfilled.match(result)) {
      setComment("");
      setRating(5);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your review?")) {
      dispatch(deleteReview(productId));
    }
  };

  return (
    <div className="mt-12 space-y-8">
      <h2 className="text-2xl font-bold">Customer Reviews</h2>

      {/* Review Form */}
      {authUser ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`transition-colors ${star <= rating ? "text-amber-400" : "text-muted"
                      }`}
                  >
                    <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-input bg-background p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Share your thoughts about this product..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={isPostingReview}
              className="rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isPostingReview ? "Posting..." : "Submit Review"}
            </button>
          </form>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-muted/50 p-6 text-center">
          <p className="text-muted-foreground">Please login to write a review.</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {!reviews || reviews.length === 0 ? (
          <p className="text-center text-muted-foreground">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => {
            const reviewer = review.reviewer || {};
            return (
              <div key={review.review_id || review.id} className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {reviewer.avatar?.url ? (
                      <img
                        src={reviewer.avatar.url}
                        alt={reviewer.name || "User"}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User size={20} />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{reviewer.name || "Anonymous"}</p>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < (review.rating || 0) ? "currentColor" : "none"}
                            className={i < (review.rating || 0) ? "" : "text-muted"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {authUser && reviewer.id === authUser.id && (
                    <button
                      onClick={handleDelete}
                      disabled={isReviewDeleting}
                      className="text-destructive hover:text-destructive/80 disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReviewsContainer;
