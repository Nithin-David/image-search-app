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
  const [fullImage, setFullImage] = useState("");
  const [flag, setFlag] = useState(false);

  let index;

  //fetch the image from the server.
  const fetchImages = useCallback(async () => {
    try {
      setError("");
      if (searchInput.current.value) {
        const { data } = await axios.get(
          `${API_URL}?query=${
            searchInput.current.value
          }&page=${page}&per_page=${imagePerPage}&client_id=${
            import.meta.env.VITE_API_KEY
          }`
        );
        setImages(data.results);
        setTotalPage(data.total_pages);
      }
    } catch (error) {
      setError("Sorry... try again later...");
    }
  }, [page]);

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

  //make the image full size when click the image.
  const handleFullImage = (imageUrl) => {
    setFullImage(imageUrl);
    setFlag(true);
  };

  //for slide the images to the previous.
  const handleImageChange = () => {
    images.map((image) => {
      if (image.urls.regular === fullImage) {
        index = images.indexOf(image);
      }
    });
  };

  //for view previous images.
  const handlePreviousImage = () => {
    handleImageChange();
    index--;
    handleFullImage(images[index].urls.regular);
  };

  //for view next images.
  const handleNextImage = () => {
    handleImageChange();
    index++;
    handleFullImage(images[index].urls.regular);
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
                onClick={() => handleFullImage(image.urls.regular)}
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
        {/* if flag true then only it will display otherwise it will be hidden. */}
        {flag ? (
          <div className="fullsize">
            <img src={fullImage} alt="" />
            <span
              className="material-symbols-outlined close"
              onClick={() => setFlag(false)}>
              close
            </span>
      
            <span
              className="material-symbols-outlined previous"
              onClick={() => handlePreviousImage()}>
              arrow_back_ios
            </span>

            <span
              className="material-symbols-outlined next"
              onClick={() => {
                handleNextImage();
              }}>
              arrow_forward_ios
            </span>
          </div>
        ) : (
          ""
        )}
        ;
      </div>
    </>
  );
}

export default App;
