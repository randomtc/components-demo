import { Carousel, Image } from 'antd';
import React from 'react';

const Home = () => {
  const imageStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  };

  const containerStyle: React.CSSProperties = {
    width: 500,
    height: 300,
    overflow: 'hidden',
  };

  const images = [
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    'https://picsum.photos/id/1015/600/400',
    'https://picsum.photos/id/1016/600/400',
    'https://picsum.photos/id/1018/600/400',
  ];

  return (
    <div style={containerStyle}>
      <Carousel arrows infinite={false}>
        {images.map((src, index) => (
          <div key={index}>
            <Image
              preview={false}
              src={src}
              style={imageStyle}
              width={500}
              height={300}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Home;
