import { useEffect, useState } from "react";

const TimePicker = ({ value = "", onChange }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Convert 24-hour time to 12-hour format
  const formatTo12Hour = (time24) => {
    if (!time24) return "";

    const [hours, minutes] = time24.split(":");

    let h = parseInt(hours, 10);

    const ampm = h >= 12 ? "PM" : "AM";

    h = h % 12 || 12;

    return `${h}:${minutes} ${ampm}`;
  };

  // Convert 12-hour time to 24-hour format
  const parse12To24 = (time12) => {
    if (!time12) return "";

    const cleanStr = time12.trim();

    const match = cleanStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

    if (!match) return "";

    let [, hStr, mStr, ampm] = match;

    let h = parseInt(hStr, 10);

    if (ampm.toUpperCase() === "PM" && h < 12) {
      h += 12;
    }

    if (ampm.toUpperCase() === "AM" && h === 12) {
      h = 0;
    }

    return `${String(h).padStart(2, "0")}:${mStr}`;
  };

  // Convert existing:
  // "9:00 PM – 10:30 PM"
  // into:
  // startTime = "21:00"
  // endTime = "22:30"
  const parseExistingTime = (timeString) => {
    if (!timeString || !timeString.includes("–")) {
      return {
        startTime: "",
        endTime: "",
      };
    }

    const [startStr, endStr] = timeString.split("–");

    return {
      startTime: parse12To24(startStr),
      endTime: parse12To24(endStr),
    };
  };

  // Load existing value
  useEffect(() => {
    if (!value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStartTime("");
      setEndTime("");
      return;
    }

    const parsed = parseExistingTime(value);

    setStartTime(parsed.startTime);
    setEndTime(parsed.endTime);
  }, [value]);

  // Handle time changes
  const handleTimeChange = (type, timeValue) => {
    let newStart = startTime;
    let newEnd = endTime;

    if (type === "start") {
      newStart = timeValue;
      setStartTime(timeValue);

      // Clear end time if it is earlier than start time
      if (newEnd && newEnd < newStart) {
        newEnd = "";
        setEndTime("");
      }
    }

    if (type === "end") {
      // Don't allow end time before start time
      if (newStart && timeValue < newStart) {
        return;
      }

      newEnd = timeValue;
      setEndTime(timeValue);
    }

    if (newStart && newEnd) {
      const formattedRange = `${formatTo12Hour(
        newStart,
      )} – ${formatTo12Hour(newEnd)}`;

      onChange?.(formattedRange);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <input
        type="time"
        value={startTime}
        onChange={(e) => handleTimeChange("start", e.target.value)}
        onClick={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") e.preventDefault();
        }}
        className="w-full rounded-lg border border-border bg-card px-4 py-3 text-text outline-none placeholder:text-[#718096] focus:border-[#0E5FD8]"
      />

      <input
        type="time"
        value={endTime}
        onChange={(e) => handleTimeChange("end", e.target.value)}
        onClick={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") e.preventDefault();
        }}
        className="w-full rounded-lg border border-border bg-card px-4 py-3 text-text outline-none placeholder:text-[#718096] focus:border-[#0E5FD8]"
      />
    </div>
  );
};

export default TimePicker;
