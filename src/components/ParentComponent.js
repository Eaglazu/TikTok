import React from "react";
import Dash1 from "./Dash1";
import PerformancePage from "./PerformancePage";

const ParentComponent = () => {
  const [sevenDaysData, setSevenDaysData] = useState([]);

  // Mettons que setSevenDaysData est appelé quelque part ici pour mettre à jour les données
  return (
    <View>
      <Dash1 setSevenDaysData={setSevenDaysData} />
      <PerformancePage sevenDaysData={sevenDaysData} />
    </View>
  );
};

export default ParentComponent;
