import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const NumberGrid = ({ monthsBack = 6 }) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based

  const [selectedRange, setSelectedRange] = useState([]);

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const handlePress = (year, month, day) => {
    if (day) {
      // Only proceed if 'day' is not null
      const dateClicked = new Date(year, month - 1, day);
      if (dateClicked <= today) {
        if (selectedRange.length === 2) {
          setSelectedRange([dateClicked]); // Start a new range
        } else {
          const newRange = [...selectedRange, dateClicked].sort(
            (a, b) => a - b
          );
          setSelectedRange(newRange.length > 2 ? [dateClicked] : newRange);
        }
      }
    }
  };

  const isDaySelected = (date) => {
    if (!date || date.getDate() === 0) return false; // Ensure not to select empty or null days
    const [start, end] = [
      selectedRange[0],
      selectedRange[selectedRange.length - 1],
    ];
    return date >= start && date <= end;
  };

  const generateGrid = (month, year) => {
    const totalDays = getDaysInMonth(month, year);
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const numbers = Array.from({ length: totalDays }, (_, i) => i + 1);
    const firstRow = Array(firstDayOfMonth)
      .fill(null)
      .concat(numbers.splice(0, 7 - firstDayOfMonth));
    const rows = [firstRow];
    while (numbers.length) rows.push(numbers.splice(0, 7));

    // Ensure all rows have exactly 7 elements
    rows.forEach((row) => {
      while (row.length < 7) row.push(null);
    });

    return (
      <View key={`month-${month}-year-${year}`} style={styles.container}>
        <Text style={styles.monthHeader}>
          {monthNames[month - 1] + " " + year}
        </Text>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((day, dayIndex) => {
              const dayDate = new Date(year, month - 1, day || 0);
              const isFuture = dayDate > today;
              return (
                <TouchableOpacity
                  key={`day-${dayIndex}`}
                  disabled={isFuture || !day}
                  onPress={() => handlePress(year, month, day)}
                  style={[
                    styles.numberContainer,
                    isDaySelected(dayDate) ? styles.selectedNumber : {},
                  ]}
                >
                  <Text
                    style={[
                      styles.number,
                      isFuture ? styles.futureDay : {},
                      isDaySelected(dayDate) ? styles.selectedText : {},
                    ]}
                  >
                    {day || ""}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const grids = [];
  for (let i = 0; i < monthsBack; i++) {
    const month = ((currentMonth - 1 - i + 12) % 12) + 1;
    const year = currentMonth - 1 - i < 0 ? currentYear - 1 : currentYear;
    grids.unshift(generateGrid(month, year)); // Use unshift to add at the start to reverse the order
  }

  return <ScrollView>{grids}</ScrollView>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  numberContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  number: {
    textAlign: "center",
    fontSize: 18,
  },
  selectedNumber: {
    backgroundColor: "red",
  },
  selectedText: {
    color: "white",
  },
  futureDay: {
    color: "grey",
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default NumberGrid;
