import React,{useState,useEffect}from 'react'
import BookCards from '../components/BookCards.jsx'

const BestSellerBooks = () => {
    const [books,setBooks]=useState([]);
    useEffect(() => {
        fetch("http://localhost:3000/all-books").then(res =>res.json()).then(data => setBooks(data.slice(3,8)))
    },[])
  return (
    <div>
      <BookCards books={books} headLine="Best Seller Books"/>
    </div>
  )
}

export default BestSellerBooks
