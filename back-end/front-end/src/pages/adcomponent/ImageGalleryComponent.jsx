// ImageGalleryComponent.js
import React from 'react';

const ImageGalleryComponent = ({ images }) => {
    return (
        <div className="imageContainer">
            {images.map((imageSrc, index) => (
                <img key={index} src={imageSrc} alt={`Ad Image ${index + 1}`} className="image" />
            ))}
            <style jsx>{`
                .imageContainer {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .image {
                    width: 100%;
                    height: auto;
                    margin-bottom: 20px;
                }
            `}</style>
        </div>
    );
};

export default ImageGalleryComponent;
