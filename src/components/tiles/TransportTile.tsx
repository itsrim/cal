import React, { useState, useEffect } from "react";
import { Tile } from "../shared/Tile";
import { readTripData } from "../../utils/readTripData";
import { renderContent } from "../../utils/renderContent";

interface TransportDataItem {
  Category: string;
  Subcategory: string;
  Item: string;
  Details: string;
}

const TransportContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("airport");
  const [transport, setTransport] = useState<{
    airport: { name: string; distance: string; options: string[] };
    train: { stations: string[]; companies: string[] };
    bus: { local: string[]; taxi: string[] };
  }>({
    airport: { name: "", distance: "", options: [] },
    train: { stations: [], companies: [] },
    bus: { local: [], taxi: [] },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data: any | TransportDataItem[] = await readTripData();
        const transportData = data.filter(
          (item: any) => item.Category === "Transport"
        );

        setTransport({
          airport: {
            name:
              transportData.find(
                (item: any) =>
                  item.Subcategory === "Airport" && item.Item === "Name"
              )?.Details || "",
            distance:
              transportData.find(
                (item: any) =>
                  item.Subcategory === "Airport" && item.Item === "Distance"
              )?.Details || "",
            options: transportData
              .filter(
                (item: any) =>
                  item.Subcategory === "Airport" && item.Item === "Option"
              )
              .map((item: any) => item.Details),
          },
          train: {
            stations: transportData
              .filter(
                (item: any) =>
                  item.Subcategory === "Train" && item.Item === "Station"
              )
              .map((item: any) => item.Details),
            companies: transportData
              .filter(
                (item: any) =>
                  item.Subcategory === "Train" && item.Item === "Company"
              )
              .map((item: any) => item.Details),
          },
          bus: {
            local: transportData
              .filter(
                (item: any) =>
                  item.Subcategory === "Bus" && item.Item === "Local"
              )
              .map((item: any) => item.Details),
            taxi: transportData
              .filter(
                (item: any) =>
                  item.Subcategory === "Bus" && item.Item === "Taxi"
              )
              .map((item: any) => item.Details),
          },
        });
      } catch (error) {
        console.error("Error loading transport data:", error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="content">
      <div className="tabs is-boxed">
        <ul>
          <li className={activeTab === "airport" ? "is-active" : ""}>
            <a
              onClick={() => setActiveTab("airport")}
              style={{
                color: "white",
                backgroundColor:
                  activeTab === "airport" ? "#01a3a4" : "transparent",
              }}
            >
              <span>Airport</span>
            </a>
          </li>
          <li className={activeTab === "train" ? "is-active" : ""}>
            <a
              onClick={() => setActiveTab("train")}
              style={{
                color: "white",
                backgroundColor:
                  activeTab === "train" ? "#01a3a4" : "transparent",
              }}
            >
              <span>Train</span>
            </a>
          </li>
          <li className={activeTab === "bus" ? "is-active" : ""}>
            <a
              onClick={() => setActiveTab("bus")}
              style={{
                color: "white",
                backgroundColor:
                  activeTab === "bus" ? "#01a3a4" : "transparent",
              }}
            >
              <span>Local Transport</span>
            </a>
          </li>
        </ul>
      </div>

      <div
        className="box has-background-dark has-text-white"
        style={{ minHeight: "300px" }}
      >
        {activeTab === "airport" && (
          <div className="airport-content">
            <h4 className="title is-5 has-text-white mb-3">
              {renderContent(transport.airport.name)}
            </h4>
            <p className="mb-3">{renderContent(transport.airport.distance)}</p>
            <ul className="ml-4">
              {transport.airport.options.map((option, index) => (
                <li key={index} className="mb-2">
                  {renderContent(option)}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "train" && (
          <div className="train-content">
            <h4 className="title is-5 has-text-white mb-3">Stations</h4>
            <div className="stations mb-4">
              {transport.train.stations.map((station, index) => (
                <div key={index} className="mb-2">
                  {renderContent(station)}
                </div>
              ))}
            </div>
            <h4 className="title is-5 has-text-white mb-3">Companies</h4>
            <div className="companies">
              {transport.train.companies.map((company, index) => (
                <div key={index} className="mb-2">
                  {renderContent(company)}
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "bus" && (
          <div className="bus-content">
            <h4 className="title is-5 has-text-white mb-3">Bus Services</h4>
            <div className="local-transport mb-4">
              {transport.bus.local.map((item, index) => (
                <div key={index} className="mb-3">
                  {renderContent(item)}
                </div>
              ))}
            </div>
            <h4 className="title is-5 has-text-white mb-3">Taxi Services</h4>
            <div className="taxi-info">
              {transport.bus.taxi.map((item, index) => (
                <div key={index} className="mb-3">
                  {renderContent(item)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const TransportTile = () => (
  <Tile title="TRANSPORT" image="/cal/trip-transport.jpg">
    <TransportContent />
  </Tile>
);
