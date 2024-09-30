import React, {useState,useEffect} from 'react'
import { Button, Checkbox, Label, Select, TextInput, Textarea} from "flowbite-react";


const UploadBook = () => {
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

    const handleBookSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        
        const bookObj = {
          bookTitle: form.bookTitle?.value || '',
          authorName: form.authorName?.value || '',
          imageURL: form.imageURL?.value || '',
          category: form.categoryName?.value || '',
          bookDescription: form.bookDescription?.value || '',
          bookPdfURL: form.bookPdfURL?.value || ''
        };
      
        console.log(bookObj);
        
        // send data to db

        fetch("http://localhost:3000/upload-book",{
            method:"POST",
            headers:{
                "Content-type": "application/json",
            },
            body:JSON.stringify(bookObj)
        }).then(res => res.json()).then(data => {
            alert("book uploaded successfully!!")
            form.reset();
        })
      };
  return (
    <div className='px-4 my-12'>
        <h2 className='mb-8 text-3xl font-bold'>Upload a book</h2>

        <form onSubmit = {handleBookSubmit} className="flex lg:w-[1180px] flex-col flex-wrap gap-4">
      <div className='lg:w-1/2'>
        <div className="mb-2 block">
          <Label htmlFor="bookTitle" value="Book Title" />
        </div>
        <TextInput id="bookTitle" name="bookTitle" type="bookTitle" placeholder="book name" required />
      </div>
      <div className='lg:w-1/2'>
        <div className="mb-2 block">
          <Label htmlFor="authorName" value="Author Name" />
        </div>
        <TextInput id="authorName" name="authorName" type="authorName" placeholder="author name" required />
      </div>

      <div className='lg:w-1/2'>
        <div className="mb-2 block">
          <Label htmlFor="imageURL" value="Book Image URL" />
        </div>
        <TextInput id="imageURL" name="imageURL" type="book image url" placeholder="book url" required />
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
        <Textarea id="comment" placeholder="Write your book description..." className='w-full' required rows={6} />
      </div>
      {/*book pdf url */}
      <div>
        <div className="mb-2 block">
          <Label htmlFor="bookPdfURL" value="Book PDF URL" />
        </div>
        <TextInput id="bookPdfURL" name="bookPdfURL" type="text" placeholder="book pdf url" required />
      </div>

      <Button type="submit" className='mt-5'>Upload Book</Button>
      
    </form>
    </div>
  )
}

export default UploadBook
