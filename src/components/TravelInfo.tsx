import React, { useState, useEffect } from "react";
import { readTripData } from "../utils/readTripData";
import { DestinationTile } from "./tiles/DestinationTile";
import { TransportTile } from "./tiles/TransportTile";
import { AgendaTile } from "./tiles/AgendaTile";
import { InfoTile } from "./tiles/InfoTile";
import { ContactTile } from "./tiles/ContactTile";

export const TravelInfo: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState(
    "/cal/trip-background.jpg"
  );
  const [title, setTitle] = useState("Titre");
  const [dateTitle, setDateTitle] = useState("Chargement... dates");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data: any = await readTripData();

        // Load background image
        const backgroundEntry = data.find(
          (item: any) => item.Category === "trip-background"
        );
        if (
          backgroundEntry?.Subcategory &&
          backgroundEntry.Subcategory.trim() !== ""
        ) {
          setBackgroundImage(backgroundEntry.Subcategory.trim());
        }

        // Load title and date - looking at Category field
        const titleEntry = data.find((item: any) => item.Category === "title");
        if (titleEntry?.Subcategory) {
          setTitle(titleEntry.Subcategory);
        }

        const dateTitleEntry = data.find(
          (item: any) => item.Category === "dateTitle"
        );
        if (dateTitleEntry?.Subcategory) {
          setDateTitle(dateTitleEntry.Subcategory);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  return (
    <div
      className="background-container"
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div
        className="travel-container"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "16px",
        }}
      >
        <header
          style={{
            padding: "20px 0",
            textAlign: "center",
            color: "white",
          }}
        >
          <h1 style={{ fontSize: "2rem", marginBottom: "8px" }}>{title}</h1>
          <p>{dateTitle}</p>
        </header>

        <div
          className="tiles-grid"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0",
          }}
        >
          <DestinationTile />
          <TransportTile />
          <AgendaTile />
          <InfoTile />
          <ContactTile />
        </div>
      </div>
    </div>
  );
};
