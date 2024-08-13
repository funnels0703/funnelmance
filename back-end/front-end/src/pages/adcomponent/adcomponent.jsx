// Adcomponent.js
import React from 'react';
import ImageGalleryComponent from './ImageGalleryComponent';
import UserInputForm from './UserInputForm';

const Adcomponent = () => {
    const images = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg',
        'https://example.com/image4.jpg',
        'https://example.com/image5.jpg',
    ];

    const handleUserSubmit = (userInfo) => {
        // 사용자 정보를 처리하는 로직을 여기에 추가합니다.
        console.log('User Information:', userInfo);
    };

    return (
        <div>
            <h1>광고 페이지</h1>
            <ImageGalleryComponent images={images} />
            <UserInputForm onSubmit={handleUserSubmit} />
        </div>
    );
};

export default Adcomponent;
