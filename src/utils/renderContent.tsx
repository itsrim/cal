import React from 'react';

export const renderContent = (content: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const clean = content.replace(/\\n/g, '\n');

  return clean.split(urlRegex).map((part, index) => {
    if (urlRegex.test(part)) {
      if (/\.(jpeg|jpg|gif|png|webp)$/i.test(part)) {
        return (
          <div key={index} style={{ 
            width: '100%', 
            overflow: 'hidden',
            marginBottom: '1rem',
            borderRadius: '8px'
          }}>
            <img 
              src={part} 
              alt="img" 
              style={{ 
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'cover'
              }} 
            />
          </div>
        );
      }
      return (
        <a 
          key={index} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{
            color: '#3498db',
            wordBreak: 'break-word'
          }}
        >
          {part}
        </a>
      );
    }
    return part.split('\n').map((line, i) => (
      <React.Fragment key={`${index}-${i}`}>
        {line}<br />
      </React.Fragment>
    ));
  });
};
