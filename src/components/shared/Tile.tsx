import React, { useState, useEffect } from 'react';
import { readTripData } from '../../utils/readTripData';

interface TileProps {
  title: string;
  image: string;
  children: React.ReactNode;
}

export const Tile: React.FC<TileProps> = ({ title, image, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(image);

  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        const data:any = await readTripData();
        const tileType = image.split('trip-')[1]?.split('.')[0];
        
        if (tileType) {
          const imageEntry = data.find((item: any) => 
            item.Category === `trip-${tileType}`
          );
          
          if (imageEntry?.Subcategory && imageEntry.Subcategory.trim() !== '') {
            setBackgroundImage(imageEntry.Subcategory.trim());
          }
        }
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    loadBackgroundImage();
  }, [image]);

  const handleClick = () => setIsOpen(!isOpen);

  return (
    <div 
      className="tile-container"
      style={{ cursor: 'pointer', marginBottom: '0' }}
    >
      <div
        className="tile-header"
        onClick={handleClick}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '150px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          className="tile-title"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '20px',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold'
          }}
        >
          {title}
        </div>
      </div>

      {isOpen && (
        <div
          className="tile-content"
          style={{
            background: '#0a0a0a',
            color: 'white',
            padding: '16px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  );
};
