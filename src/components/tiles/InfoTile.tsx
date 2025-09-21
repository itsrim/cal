import React, { useState, useEffect } from "react";
import { renderContent } from "../../utils/renderContent";
import { Tile } from "../shared/Tile";
import { readTripData } from "../../utils/readTripData";

interface PracticalInfo {
  item: string;
  details: string;
}

const InfoContent: React.FC = () => {
  const [practicalInfo, setPracticalInfo] = useState<PracticalInfo[]>([]);

  useEffect(() => {
    const loadPracticalInfo = async () => {
      try {
        const data: any = await readTripData();
        const practicalInfoItems = data
          .filter((item: any) => item.Category === "Practical Info")
          .map((item: any) => ({
            item: item.Item,
            details: item.Details || item.Subcategory,
          }));
        setPracticalInfo(practicalInfoItems);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des informations pratiques:",
          error
        );
      }
    };

    loadPracticalInfo();
  }, []);

  return (
    <div>
      <table className="table is-fullwidth">
        <tbody>
          {practicalInfo.map((info, index) => (
            <tr key={index}>
              <td
                style={{
                  backgroundColor: "#01a3a4",
                  color: "white",
                  padding: "12px",
                  width: "200px",
                }}
              >
                {info.item}
              </td>
              <td
                style={{
                  backgroundColor: "#576574",
                  color: "white",
                  padding: "12px",
                }}
              >
                {renderContent(info.details)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const InfoTile = () => (
  <Tile title="INFORMATIONS PRATIQUES" image="/cal/trip-info.jpg">
    <InfoContent />
  </Tile>
);
