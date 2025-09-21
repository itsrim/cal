import React, { useState, useEffect } from "react";
import { renderContent } from "../../utils/renderContent";
import { Tile } from "../shared/Tile";
import { readTripData } from "../../utils/readTripData";

interface Contact {
  item: string;
  details: string;
}

const ContactContent: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data: any = await readTripData();
        const contactItems = data
          .filter((item: any) => item.Category === "Contacts")
          .map((item: any) => ({
            item: item.Item,
            details: item.Details || item.Subcategory,
          }));
        setContacts(contactItems);
      } catch (error) {
        console.error("Erreur lors du chargement des contacts:", error);
      }
    };

    loadContacts();
  }, []);

  return (
    <div>
      <table className="table is-fullwidth">
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={index}>
              <td
                style={{
                  backgroundColor: "#01a3a4",
                  color: "white",
                  padding: "12px",
                  width: "200px",
                }}
              >
                {contact.item}
              </td>
              <td
                style={{
                  backgroundColor: "#576574",
                  color: "white",
                  padding: "12px",
                }}
              >
                {renderContent(contact.details)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const ContactTile = () => (
  <Tile title="CONTACTS" image="/cal/trip-contacts.jpg">
    <ContactContent />
  </Tile>
);
