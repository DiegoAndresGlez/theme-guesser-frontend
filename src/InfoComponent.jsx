import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import doodleStars from "./assets/img/doodle-stars.png"; 

const InfoComponent = ({ title, content }) => {
  return (
    <Card className="w-full max-w-sm mt-2 shadow-lg bg-card-background rounded-xl border border-black p-4">
      <CardHeader className="flex items-center justify-center gap-2 text-2xl text-accent p-0">
        <img src={doodleStars} alt="Sparkles" className="h-6 w-6" aria-hidden="true" />
        <span>{title}</span>
      </CardHeader>
      <CardBody className="text-accent gap-3">
        {content.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </CardBody>
    </Card>
  );
};

export default InfoComponent;
