// Charts.js
import React from "react";
import CustomChart7days from "./CustomChart/30days";
import CustomChart30days from "./CustomChart/30days";
import CustomChartDepuis from "./CustomChart/Depuis";

export const Chart7Days = ({ dataPoints }) => {
  return <CustomChart7days dataPoints={dataPoints} />;
};

export const Chart30Days = ({ dataPoints }) => {
  return <CustomChart30days dataPoints={dataPoints} />;
};

export const ChartDepuisLe = ({ dataPoints }) => {
  return <CustomChartDepuis dataPoints={dataPoints} />;
};

// Vous pouvez ajouter plus de composants ici pour d'autres périodes.
