import React from 'react';
import { Star } from 'lucide-react';

const Reviews = () => {
  // Dummy reviews data
  const reviews = [
    { id: 1, name: 'Alice', rating: 5, comment: 'Amazing book and fast delivery!' },
    { id: 2, name: 'Bob', rating: 4, comment: 'Great selection and easy checkout.' },
    { id: 3, name: 'Charlie', rating: 5, comment: 'Customer support was very helpful.' }
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Customer Reviews</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <div className="flex items-center mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="font-semibold mb-1">{review.name}</div>
              <div className="text-gray-600 text-center">{review.comment}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
