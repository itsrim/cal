import React, { useState, useEffect } from "react";
import { Tile } from "../shared/Tile";
import { readTripData } from "../../utils/readTripData";
import { renderContent } from "../../utils/renderContent";

interface DayScheduleProps {
  date: string;
  dayNumber: string;
  month: string;
  isToday: boolean;
  activities: Array<{ time: string; activity: string }>;
}

const DaySchedule: React.FC<DayScheduleProps> = ({
  date,
  dayNumber,
  month,
  isToday,
  activities,
}) => {
  const [isOpen, setIsOpen] = useState(isToday);

  return (
    <div className="day-schedule has-background-dark has-text-white mb-2">
      <div
        className="day-header p-4"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: "pointer",
          backgroundColor: isOpen ? "#01a3a4" : "#2d3436", // Couleur active identique à celle du tableau
          color: "white",
          borderRadius: isOpen ? "8px 8px 0 0" : "8px",
          transition: "background-color 0.3s ease",
        }}
      >
        <h3 className="has-text-white mb-0">
          {date} {dayNumber} {month}
        </h3>
      </div>

      {isOpen && (
        <div className="schedule-content p-4">
          <table
            className="table is-fullwidth"
            style={{ color: "white", borderCollapse: "collapse" }}
          >
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index}>
                  <td
                    style={{
                      width: "120px",
                      backgroundColor: "#01a3a4",
                      padding: "12px",
                      color: "white",
                    }}
                  >
                    {activity.time}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      backgroundColor: "#576574",
                      color: "white",
                    }}
                  >
                    {renderContent(activity.activity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AgendaContent: React.FC = () => {
  const [schedule, setSchedule] = useState<
    Array<{
      date: string;
      dayNumber: string;
      month: string;
      activities: Array<{ time: string; activity: string }>;
    }>
  >([]);

  useEffect(() => {
    const loadTripData = async () => {
      try {
        const data: any = await readTripData();
        const agendaItems = data.filter(
          (item: any) => item.Category === "Agenda"
        );

        const groupedActivities = agendaItems.reduce((acc: any, item: any) => {
          const [dayName, dayNumber, month] = item.Subcategory.split(" ");

          const existingDay = acc.find(
            (d: any) =>
              d.date === dayName &&
              d.dayNumber === dayNumber &&
              d.month === month
          );

          const activity = {
            time: item.Item,
            activity: item.Details,
          };

          if (existingDay) {
            existingDay.activities.push(activity);
          } else {
            acc.push({
              date: dayName,
              dayNumber,
              month,
              activities: [activity],
            });
          }

          return acc;
        }, []);

        setSchedule(groupedActivities);
      } catch (error) {
        console.error("Error loading agenda data:", error);
      }
    };
    loadTripData();
  }, []);

  return (
    <div>
      {schedule.map((day, index) => (
        <DaySchedule
          key={index}
          date={day.date}
          dayNumber={day.dayNumber}
          month={day.month}
          activities={day.activities}
          isToday={false}
        />
      ))}
    </div>
  );
};

export const AgendaTile = () => (
  <Tile title="AGENDA" image="/cal/trip-calendar.jpg">
    <AgendaContent />
  </Tile>
);
