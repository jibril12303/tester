import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import PropTypes from 'prop-types';


// export type ImageType = { id: number; url: string };

const ImageCarousel = ({ images,selectedImgCatogory,setHighlightImage,setLightbox }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState();
  const carouselItemsRef = useRef([]);

  useEffect(() => {
    if (images && images[0]) {
      carouselItemsRef.current = carouselItemsRef.current.slice(
        0,
        images.length
      );

      setSelectedImageIndex(0);
      setSelectedImage(images[0]);
    }
  }, [images]);

  const handleSelectedImageChange = (newIdx) => {
    if (images && images.length > 0) {
      setSelectedImage(images[newIdx]);
      setSelectedImageIndex(newIdx);
      if (carouselItemsRef?.current[newIdx]) {
        carouselItemsRef?.current[newIdx]?.scrollIntoView({
          inline: "center",
          behavior: "smooth"
        });
      }
    }
  };

  const handleRightClick = () => {
    if (images && images.length > 0) {
      let newIdx = selectedImageIndex + 1;
      if (newIdx >= images.length) {
        newIdx = 0;
      }
      handleSelectedImageChange(newIdx);
    }
  };

  const handleLeftClick = () => {
    if (images && images.length > 0) {
      let newIdx = selectedImageIndex - 1;
      if (newIdx < 0) {
        newIdx = images.length - 1;
      }
      handleSelectedImageChange(newIdx);
    }
  };

  return (
    <div className="carousel-container">
      <h2 className="header">{selectedImgCatogory}{":"}</h2>
      <div
        className="selected-image"
        style={{ backgroundImage: `url(${selectedImage?.url})` }}
        onClick={()=>{
          setHighlightImage({src: selectedImage?.url, type:'image/png'})
          setLightbox(true)
        }}
      />
      <div className="carousel">
        <div className="carousel__images">
          {images &&
            images.map((image, idx) => (
              <div
                onClick={() => handleSelectedImageChange(idx)}
                style={{ backgroundImage: `url(${image.url})` }}
                key={image.id}
                className={`carousel__image ${
                  selectedImageIndex === idx && "carousel__image-selected"
                }`}
                ref={(el) => (carouselItemsRef.current[idx] = el)}
              />
            ))}
        </div>
        <button
          className="carousel__button carousel__button-left"
          onClick={handleLeftClick}
        >
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button
          className="carousel__button carousel__button-right"
          onClick={handleRightClick}
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </div>
  );
};


ImageCarousel.propTypes = {
  images: PropTypes.any,
  selectedImgCatogory: PropTypes.any,
  setHighlightImage:PropTypes.any,
  setLightbox:PropTypes.any
};
export default ImageCarousel;
