import { Form, Button } from "react-bootstrap";
import "./index.css";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const API_URL = "https://api.unsplash.com/search/photos";
const imagePerPage = 24;

function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [error, setError] = useState("");

  //fetch the image from the server.
  const fetchImages = useCallback(async () => {
    try {
      setError("")
      if(searchInput.current.value){
         const { data } = await axios.get(
           `${API_URL}?query=${
             searchInput.current.value
           }&page=${page}&per_page=${imagePerPage}&client_id=${
             import.meta.env.VITE_API_KEY
           }`
         );
         setImages(data.results);
         setTotalPage(data.total_pages);
      }} catch (error) {
        setError("Sorry... try again later...")
    }
  },[page]);
  
  //render every time when changes happend.
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  //set first page evety time search new item.
  const handleImageFirst = () => {
    setPage(1);
    fetchImages();
  };

  //for submit the input form.
  const handleSearch = (event) => {
    event.preventDefault();
    handleImageFirst();
  };

  //for the quick search button rendering.
  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    handleImageFirst();
  };

  return (
    <>
      <div className="container">
        <h1 className="title">Image Search</h1>
        {error && <p className="error-msg">{error}</p>}
        <div className="search-section">
          <form onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Enter something to search..."
              className="search-input"
              ref={searchInput}
            />
          </form>
        </div>
        <div className="filters">
          <div onClick={() => handleSelection("Nature")}>Nature</div>
          <div onClick={() => handleSelection("Landscape")}>Landscape</div>
          <div onClick={() => handleSelection("Animals")}>Animals</div>
          <div onClick={() => handleSelection("Cars")}>Cars</div>
        </div>
        <div className="images">
          {images.map((image) => {
            return (
              <img
                key={image.id}
                src={image.urls.small}
                alt={image.description}
                className="image"
              />
            );
          })}
        </div>
        <div className="buttons">
          {page > 1 && (
            <Button onClick={() => setPage(page - 1)}>Previous</Button>
          )}
          {page < totalPage && (
            <Button
              onClick={() => {
                setPage(page + 1);
              }}>
              next
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
