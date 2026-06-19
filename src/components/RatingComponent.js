import React from 'react';

export default function RatingComponent({ rating, onRatingChange, interactive = false }) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex gap-1">
      {stars.map(star => (
        <button
          key={star}
          onClick={() => interactive && onRatingChange(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          disabled={!interactive}
          className={`text-2xl transition cursor-pointer ${
            star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ⭐
        </button>
      ))}
      <span className="ml-2 text-gray-600 font-semibold">({rating.toFixed(1)})</span>
    </div>
  );
}
