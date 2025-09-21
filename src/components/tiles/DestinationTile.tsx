import React, { useState, useEffect } from "react";
import { Tile } from "../shared/Tile";
import { readTripData } from "../../utils/readTripData";
import { renderContent } from "../../utils/renderContent";

const DestinationContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("cities");
  const [destination, setDestination] = useState({
    cities: [] as string[],
    hotel: "",
    weather: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data: any = await readTripData();
        const destinationData = data.filter(
          (item: any) => item.Category === "Destination"
        );

        setDestination({
          cities: destinationData
            .filter((item: any) => item.Subcategory === "Cities")
            .map((item: any) => item.Item), // Should probably use Details instead of Item
          hotel:
            destinationData.find((item: any) => item.Subcategory === "Hotel")
              ?.Item || "", // Should use Details
          weather:
            destinationData.find((item: any) => item.Subcategory === "Weather")
              ?.Item || "", // Should use Details
        });
      } catch (error) {
        console.error("Error loading destination data:", error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="content">
      <div className="tabs is-boxed">
        <ul>
          <li className={activeTab === "cities" ? "is-active" : ""}>
            <a
              onClick={() => setActiveTab("cities")}
              style={{
                color: "white",
                backgroundColor:
                  activeTab === "cities" ? "#01a3a4" : "transparent",
              }}
            >
              <span>Cities</span>
            </a>
          </li>
          <li className={activeTab === "hotel" ? "is-active" : ""}>
            <a
              onClick={() => setActiveTab("hotel")}
              style={{
                color: "white",
                backgroundColor:
                  activeTab === "hotel" ? "#01a3a4" : "transparent",
              }}
            >
              <span>Hotel</span>
            </a>
          </li>
          <li className={activeTab === "weather" ? "is-active" : ""}>
            <a
              onClick={() => setActiveTab("weather")}
              style={{
                color: "white",
                backgroundColor:
                  activeTab === "weather" ? "#01a3a4" : "transparent",
              }}
            >
              <span>Weather</span>
            </a>
          </li>
        </ul>
      </div>

      <div
        className="box has-background-dark has-text-white"
        style={{ minHeight: "300px" }}
      >
        {activeTab === "cities" && (
          <div className="cities-content">
            {destination.cities.map((city, index) => (
              <div key={index} className="mb-4">
                {renderContent(city)}
              </div>
            ))}
          </div>
        )}
        {activeTab === "hotel" && (
          <div className="hotel-content">
            <div className="mb-4">{renderContent(destination.hotel)}</div>
          </div>
        )}
        {activeTab === "weather" && (
          <div className="weather-content">
            <div className="mb-4">{renderContent(destination.weather)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export const DestinationTile = () => (
  <Tile
    title="DESTINATION"
    // image="/cal/trip-destination.jpg"
    image="/cal/trip-destination.jpg"
  >
    <DestinationContent />
  </Tile>
);
