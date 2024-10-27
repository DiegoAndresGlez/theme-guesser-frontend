import React from "react";

const InfoComponent = ({ title, content }) => {
  return (
    <div className="w-full max-w-md p-6 bg-darkBlue rounded-lg shadow-lg text-center mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-yellow-400">{title}</h2>
      {/*for n number of paragraphs*/}
      {content.map((text, index) => (
        <p key={index} className="text-white text-sm mb-4">
          {text}
        </p>
      ))}
    </div>
  );
};

export default InfoComponent;
