import React from "react";

interface Props {
  rating: number;
}

const RatingStars: React.FC<Props> = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex justify-center">
      {stars.map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={star <= rating ? "gold" : "lightgray"}
          className="w-5 h-5"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.287 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.044 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.287-3.97z" />
        </svg>
      ))}
    </div>
  );
};

export default RatingStars;
