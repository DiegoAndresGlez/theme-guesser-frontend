import React from 'react';

const InfoComponent = ({ title, content }) => {
  return (
    <div>
      <h2>{title}</h2>
      {/* n number of paragraphs */}
      {content.map((text, index) => (
        <h4 key={index}>{text}</h4>
      ))}
    </div>
  );
};

export default InfoComponent;
