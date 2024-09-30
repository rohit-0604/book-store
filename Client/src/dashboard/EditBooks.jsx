import React, {useState,useEffect} from 'react'
import { Button, Checkbox, Label, Select, TextInput, Textarea} from "flowbite-react";
import { useLoaderData, useParams } from 'react-router-dom';
const EditBooks = () => {
  const {id} = useParams();
  const {bookTitle, authorName, imageURL, category, bookDescription, bookPdfURL} = useLoaderData();
  const bookCategories = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Programming",
    "Science Fiction",
    "Fantasy",
    "Horror",
    "Bibliography",
    "Autobiography",
    "History",
    "Self-help",
    "Memoir",
    "Business",
    "Children Books",
    "Travel",
    "Religion",
    "Art and Design"
]

const [selectedBookCategory, setSelectedBookCategory] = useState(bookCategories[0]);

const handleChangeSelectedValue = (event) => {
    //console.log(event.target.value);
    setSelectedBookCategory(event.target.value);
}

// handle book submission

const handleUpdate = (event) => {
    event.preventDefault();
    const form = event.target;
    
    const updateBookObj = {
      bookTitle: form.bookTitle?.value || '',
      authorName: form.authorName?.value || '',
      imageURL: form.imageURL?.value || '',
      category: form.categoryName?.value || '',
      bookDescription: form.bookDescription?.value || '',
      bookPdfURL: form.bookPdfURL?.value || ''
    };
  
    //console.log(updateBookObj);
    // update book data

    fetch(`http://localhost:3000/book/${id}`,{
      method:"PATCH",
      headers:{
          "Content-type": "application/json",
      },
      body:JSON.stringify(updateBookObj)
  }).then(res => res.json()).then(data => {
      alert("book is updated successfully!!")
      //form.reset();
  })

  };
return (
<div className='px-4 my-12'>
    <h2 className='mb-8 text-3xl font-bold'>Upload the book data</h2>

    <form onSubmit = {handleUpdate} className="flex lg:w-[1180px] flex-col flex-wrap gap-4">
  <div className='lg:w-1/2'>
    <div className="mb-2 block">
      <Label htmlFor="bookTitle" value="Book Title" />
    </div>
    <TextInput id="bookTitle" name="bookTitle"  placeholder="book name" required type="text" defaultValue={bookTitle}/>
  </div>
  <div className='lg:w-1/2'>
    <div className="mb-2 block">
      <Label htmlFor="authorName" value="Author Name" />
    </div>
    <TextInput id="authorName" name="authorName" type="text" placeholder="author name" required defaultValue = {authorName} />
  </div>

  <div className='lg:w-1/2'>
    <div className="mb-2 block">
      <Label htmlFor="imageURL" value="Book Image URL" />
    </div>
    <TextInput id="imageURL" name="imageURL" type="url" placeholder="book url" required defaultValue={imageURL}/>
  </div>

  <div className='lg:w-1/2'>
    <div className="mb-2 block">
      <Label htmlFor="inputState" value="Book Category" />
    </div>

    <Select id='inputState' name='categoryName' className='w-full rounded' value={selectedBookCategory} onChange={handleChangeSelectedValue}>
        {
            bookCategories.map((category) => <option key={category} value={category}>{category}</option>)
        }

    </Select>
    </div>

    <div>
    <div className="mb-2 block">
      <Label htmlFor="bookDescription" value="Book Description" />
    </div>
    <Textarea id="comment" placeholder="Write your book description..." className='w-full' required rows={6} defaultValue={bookDescription}/>
  </div>
  {/*book pdf url */}
  <div>
    <div className="mb-2 block">
      <Label htmlFor="bookPdfURL" value="Book PDF URL" />
    </div>
    <TextInput id="bookPdfURL" name="bookPdfURL" type="text" placeholder="book pdf url" required defaultValue={bookPdfURL}/>
  </div>

  <Button type="submit" className='mt-5'>Update Book</Button>
  
</form>
</div>
)
}

export default EditBooks
