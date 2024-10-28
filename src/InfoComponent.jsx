import React from "react";
import { Button, Input, Card, CardHeader } from "@nextui-org/react";

const InfoComponent = ({ title, content }) => {
  return (
    <Card className="w-full max-w-md text-center bg-primary">
      <CardHeader className="">{title}</CardHeader>
      {/*for n number of paragraphs*/}
      {content.map((text, index) => (
        <p key={index} className="">
          {text}
        </p>
      ))}
    </Card>
  );
};

export default InfoComponent;
