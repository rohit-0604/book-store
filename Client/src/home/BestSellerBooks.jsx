import React, { useState, useEffect } from 'react';
import BookCards from '../components/BookCards.jsx';

const BestSellerBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://online-book-store-orcin.vercel.app/api';
        
        fetch(`${apiUrl}/all-books`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch books');
                return res.json();
            })
            .then(data => {
                setBooks(data.slice(3, 8));
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching books:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading books...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div>
            <BookCards books={books} headLine="Best Seller Books" />
        </div>
    );
};

export default BestSellerBooks;
