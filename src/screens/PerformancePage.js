import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Dimensions,
} from "react-native";
import useStore from "./useStore";
import CustomChart7days from "../components/CustomChart/7days";
import ThirtyDaysVue from "../components/CustomChartVue/ThirtyDaysVue";

const screenWidth = Dimensions.get("window").width; // Obtient la largeur de l'écran

const calculateAverageVue = (dataVue) => {
  if (!dataVue || dataVue.length === 0) return "0.00"; // Vérification pour éviter les erreurs
  const sumVue = dataVue.reduce((accVue, valueVue) => accVue + valueVue, 0);
  return (sumVue / dataVue.length).toFixed(2); // Arrondit à deux décimales
};

// Composant pour un panel repliable
const RepliablePanelVue = ({ titleVue, childrenVue }) => {
  const [isOpenVue, setIsOpenVue] = useState(true);

  const togglePanelVue = () => {
    setIsOpenVue(!isOpenVue);
  };

  return (
    <View style={styles.panelContainerVue}>
      <TouchableOpacity style={styles.panelHeaderVue} onPress={togglePanelVue}>
        <Image
          style={styles.infoIconVue}
          source={require("../assets/images/info.png")}
        />
        <Text style={styles.panelTitleVue}>{titleVue}</Text>
        <Image
          style={styles.toggleIconVue}
          source={
            isOpenVue
              ? require("../assets/images/flecheTop.png")
              : require("../assets/images/flecheDown.png")
          }
        />
      </TouchableOpacity>
      {isOpenVue && <View style={styles.panelContentVue}>{childrenVue}</View>}
    </View>
  );
};

const getDatesForLabels7Vue = () => {
  const nowVue = new Date();
  nowVue.setDate(nowVue.getDate() - 1); // Définir à hier

  let datesVue = [];
  for (let iVue = 6; iVue >= 0; iVue--) {
    const dateVue = new Date(nowVue.getTime() - iVue * 24 * 60 * 60 * 1000);
    datesVue.push(
      dateVue.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
    );
  }

  return datesVue;
};

const getDatesForLabels30Vue = () => {
  const nowVue = new Date(); // Obtenir la date et l'heure actuelle
  nowVue.setDate(nowVue.getDate() - 1); // Définir à hier pour avoir la dernière valeur avec un jour de retard

  let datesVue = [];
  for (let iVue = 29; iVue >= 0; iVue--) {
    // Commencez par 29 jours en arrière et décomptez jusqu'à aujourd'hui
    const dateVue = new Date(nowVue.getTime() - iVue * 24 * 60 * 60 * 1000);
    datesVue.push(
      dateVue.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
    );
  }

  return datesVue;
};
const getBottomDatesForLabels30Vue = () => {
  const nowVue = new Date();
  nowVue.setDate(nowVue.getDate() - 1); // Set to yesterday

  let bottomDatesVue = [];
  for (let iVue = 29; iVue >= 0; iVue -= 5) {
    const dateVue = new Date(nowVue.getTime() - iVue * 24 * 60 * 60 * 1000);
    bottomDatesVue.push(
      dateVue.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
    );
  }
  return bottomDatesVue;
};

const SeptJoursContentVue = () => {
  const dataPointsVue = useStore((state) => state.dataPoints7DaysVue) || []; // Utilisation des données du store
  const dateLabelsVue = getDatesForLabels7Vue();

  const averageRpmVue = calculateAverageVue(dataPointsVue); // Calcule la moyenne
  console.log("Data points:", dataPointsVue);
  console.log("Date labels:", dateLabelsVue);
  return (
    <View style={styles.customContentVue}>
      <View style={styles.rpmContainerVue}>
        <Text style={styles.euroSymbolVue}>€</Text>
        <Text style={styles.rpmValueVue}>{averageRpmVue}</Text>
      </View>
      <View style={styles.graphContainerVue}>
        <CustomChart7days
          dataPoints={dataPointsVue}
          dateLabels={dateLabelsVue}
        />
      </View>
      <RepliablePanelVue titleVue="Qu'est-ce qui détermine ton RPM ?">
        <Text style={styles.paragraphVue}>
          Le nombre de récompenses que tu reçois pour chaque millier de vues en
          le RPM, dépend de plusieurs facteurs :
        </Text>
        <View style={styles.bulletItemfirstVue}>
          <Text style={styles.bulletPointVue}>●</Text>
          <Text style={styles.bulletTextVue}>
            Performances des vidéos : elles comprennent le temps de visionnage
            moyens et le taux d'achèvements
          </Text>
        </View>
        <View style={styles.bulletItemfirstVue}>
          <Text style={styles.bulletPointVue}>●</Text>
          <Text style={styles.bulletTextVue}>
            Les performances de recherche de tes vidéos
          </Text>
        </View>
        <View style={styles.bulletItemVue}>
          <Text style={styles.bulletPointVue}>●</Text>
          <Text style={styles.bulletTextVue}>
            La répartition régionale des vues éligibles
          </Text>
        </View>
        <View style={styles.bulletItemVue}>
          <Text style={styles.bulletPointVue}>●</Text>
          <Text style={styles.bulletTextVue}>
            Le pourcentage de followers qui interagissent beaucoup
          </Text>
        </View>
        <View style={styles.bulletItemVue}>
          <Text style={styles.bulletTextVue}>Valeurs publicitaires</Text>
        </View>
        <View style={styles.bulletItemVue}>
          <Text style={styles.bulletTextblueVue}>En savoir plus </Text>
        </View>
      </RepliablePanelVue>
    </View>
  );
};

const TrenteJoursContentVue = () => {
  // Générer les données pour le graphique
  const dataPointsVue = useStore((state) => state.dataPoints30DaysVue) || [];
  const dateLabelsVue = getDatesForLabels30Vue();
  const bottomDateLabelsVue = getBottomDatesForLabels30Vue();
  const averageRpmVue = calculateAverageVue(dataPointsVue); // Calcule la moyenne
  return (
    <View style={styles.customContentVue}>
      <View style={styles.rpmContainerVue}>
        <Text style={styles.euroSymbolVue}>€</Text>
        <Text style={styles.rpmValueVue}>{averageRpmVue}</Text>
      </View>
      <View style={styles.graphContainerVue}>
        <ThirtyDaysVue
          dataPoints={dataPointsVue}
          dateLabels={dateLabelsVue}
          bottomDateLabels={bottomDateLabelsVue}
        />
      </View>
      <RepliablePanelVue titleVue="Qu'est-ce qui détermine ton RPM ?">
        <Text style={styles.paragraphVue}>
          Le nombre de récompenses que tu reçois pour chaque millier de vues en
          le RPM, dépend de plusieurs facteurs :
        </Text>
        <View style={styles.bulletItemfirstVue}>
          <Text style={styles.bulletPointVue}>●</Text>
          <Text style={styles.bulletTextVue}>
            Performances des vidéos : elles comprennent le temps de visionnage
            moyens et le taux d'achèvements
          </Text>
        </View>
        <View style={styles.bulletItemfirstVue}>
          <Text style={styles.bulletPointVue}>●</Text>
          <Text style={styles.bulletTextVue}>
            Les performances de recherche de tes vidéos
          </Text>
        </View>
        <View style={styles.bulletItemVue}>
          <Text style={styles.bulletPointVue}>●</Text>
          <Text style={styles.bulletTextVue}>
            La répartition régionale des vues éligibles
          </Text>
        </View>
        <View style={styles.bulletItemVue}>
          <Text style={styles.bulletPointVue}>●</Text>
          <Text style={styles.bulletTextVue}>
            Le pourcentage de followers qui interagissent beaucoup
          </Text>
        </View>
        <View style={styles.bulletItemVue}>
          <Text style={styles.bulletTextVue}>Valeurs publicitaires</Text>
        </View>
        <View style={styles.bulletItemVue}>
          <Text style={styles.bulletTextblueVue}>En savoir plus </Text>
        </View>
      </RepliablePanelVue>
    </View>
  );
};

const PerformancePage = () => {
  const [selectedTabVue, setSelectedTabVue] = useState("RPM");
  const [modalVisibleVue, setModalVisibleVue] = useState(false);
  const [selectedPeriodVue, setSelectedPeriodVue] = useState("30 jours");
  const [dataPointsVue, setDataPointsVue] = useState([]);
  const [dateLabelsVue, setDateLabelsVue] = useState([]);
  const [bottomDateLabelsVue, setBottomDateLabelsVue] = useState([]);
  const lastModalStateVue = useRef(modalVisibleVue);

  const currentRpmVue = useStore((state) => state.currentRpm);
  const dataPoints7DaysVue = useStore((state) => state.dataPoints7DaysVue);
  const dataPoints30DaysVue = useStore((state) => state.dataPoints30DaysVue);
  const addRpmToDataPoints7DaysVue = useStore(
    (state) => state.addRpmToDataPoints7DaysVue
  );
  useEffect(() => {
    setDataPointsVue(dataPoints30DaysVue);
    setDateLabelsVue(getDatesForLabels30Vue());
    setBottomDateLabelsVue(getBottomDatesForLabels30Vue());
  }, [dataPoints30DaysVue]);

  const handleOpenModalVue = () => {
    setModalVisibleVue(true);
    lastModalStateVue.current = true; // Mettre à jour l'état de référence du modal comme ouvert
  };

  const optionsVue = [
    "7 jours",
    "30 jours",
    "Depuis le début",
    "Période personnalisée",
  ];

  const renderContentVue = () => {
    switch (selectedPeriodVue) {
      case "7 jours":
        return <SeptJoursContentVue />;
      case "30 jours":
        return <TrenteJoursContentVue />;
      default:
        return (
          <View>
            <Text>Sélectionnez une période</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.containerVue}>
      <View style={styles.tabsContainerVue}>
        <TouchableOpacity
          style={[
            styles.tabVue,
            selectedTabVue === "Vue" && styles.activeTabVue,
          ]}
          onPress={() => setSelectedTabVue("Vue")}
        >
          <Text
            style={[
              styles.tabTextVue,
              selectedTabVue === "Vue" && styles.activeTabTextVue,
            ]}
          >
            Vues éligibles
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabVue,
            selectedTabVue === "RPM" && styles.activeTabVue,
          ]}
          onPress={() => setSelectedTabVue("RPM")}
        >
          <Text
            style={[
              styles.tabTextVue,
              selectedTabVue === "RPM" && styles.activeTabTextVue,
            ]}
          >
            RPM
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainerVue}>
        {selectedTabVue === "RPM" && (
          <View style={styles.headerContainerVue}>
            <Text style={styles.headerTitleVue}>RPM</Text>
            <TouchableOpacity
              style={styles.buttonVue}
              onPress={handleOpenModalVue}
            >
              <Text style={styles.buttonTextVue}>{selectedPeriodVue}</Text>
              <Image
                style={styles.buttonIconVue}
                source={require("../assets/images/chevronBas.png")}
              />
            </TouchableOpacity>
          </View>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleVue}
          onRequestClose={() => {
            setModalVisibleVue(!modalVisibleVue);
          }}
        >
          <View style={styles.modalViewVue}>
            <View style={styles.modalContentVue}>
              <View style={styles.modalHeaderVue}>
                <Text style={styles.modalTitleVue}>
                  Sélectionner la plage de dates
                </Text>
                <TouchableOpacity onPress={() => setModalVisibleVue(false)}>
                  <Image
                    style={styles.modalHeaderIconVue}
                    source={require("../assets/images/closes.png")}
                  />
                </TouchableOpacity>
              </View>
              {optionsVue.map((optionVue, indexVue) => (
                <TouchableOpacity
                  key={indexVue}
                  style={[
                    styles.optionVue,
                    selectedPeriodVue === optionVue && styles.selectedOptionVue,
                    indexVue === optionsVue.length - 1 && styles.lastOptionVue,
                  ]}
                  onPress={() => {
                    setSelectedPeriodVue(optionVue);
                    setModalVisibleVue(false);
                  }}
                >
                  <View style={styles.optionContentVue}>
                    <Text style={styles.optionTextVue}>{optionVue}</Text>
                    {optionVue === "Période personnalisée" ? (
                      <Image
                        source={require("../assets/images/chevronR.png")}
                        style={styles.customPeriodImageVue}
                      />
                    ) : (
                      <View
                        style={[
                          styles.indicatorVue,
                          selectedPeriodVue === optionVue
                            ? styles.indicatorActiveVue
                            : styles.indicatorInactiveVue,
                        ]}
                      >
                        {selectedPeriodVue === optionVue && (
                          <View style={styles.innerIndicatorVue} />
                        )}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.bottomSpaceVue} />
          </View>
        </Modal>
        {renderContentVue()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerVue: {
    flex: 1,
  },
  tabsContainerVue: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    backgroundColor: "#ededed",
  },
  tabVue: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  tabTextVue: {
    color: "grey",
    fontSize: 16,
  },
  activeTabVue: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
    marginHorizontal: 20,
  },
  activeTabTextVue: {
    color: "black",
  },
  contentContainerVue: {
    flex: 1,
    padding: 20,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  headerContainerVue: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  headerTitleVue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  buttonVue: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ededed",
    padding: 10,
    borderRadius: 10,
  },
  buttonTextVue: {
    color: "black",
    marginRight: 5,
  },
  buttonIconVue: {
    width: 20,
    height: 20,
  },
  customPeriodImageVue: {
    width: 24,
    height: 24,
  },
  modalViewVue: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContentVue: {
    backgroundColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalHeaderVue: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingBottom: 0,
  },
  modalTitleVue: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  modalHeaderIconVue: {
    width: 20,
    height: 20,
  },
  optionVue: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionContentVue: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  optionTextVue: {
    fontSize: 18,
    color: "black",
    flex: 1,
  },
  indicatorContainerVue: {
    width: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorVue: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D3D3D3",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorActiveVue: {
    borderColor: "#FF0000",
    backgroundColor: "white",
  },
  indicatorInactiveVue: {
    backgroundColor: "transparent",
  },
  innerIndicatorVue: {
    width: 14,
    height: 14,
    borderRadius: 10,
    backgroundColor: "#FF0000",
    marginAuto: true,
  },
  lastOptionVue: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  bottomSpaceVue: {
    height: 20,
    backgroundColor: "white",
  },
  rpmContainerVue: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-start",
    marginTop: -5,
  },
  euroSymbolVue: {
    fontSize: 17,
    marginRight: 1,
  },
  rpmValueVue: {
    fontSize: 26,
    fontWeight: "bold",
  },
  dateContainerVue: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 5,
  },
  dateTextVue: {
    fontSize: 16,
    color: "grey",
  },
  dashVue: {
    fontSize: 16,
    marginHorizontal: 1,
  },
  panelContainerVue: {
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    marginVertical: 10,
    overflow: "hidden",
    width: screenWidth - 40,
  },
  infoIconVue: {
    width: 15,
    height: 15,
    marginRight: -50,
  },
  panelHeaderVue: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#e2e2e2",
  },
  panelTitleVue: {
    fontSize: 14,
  },
  toggleIconVue: {
    width: 24,
    height: 24,
  },
  iconStyleVue: {
    width: 24,
    height: 24,
  },
  panelContentVue: {
    padding: 15,
    paddingBottom: 0,
  },
  paragraphVue: {
    marginBottom: 10,
  },
  bulletItemfirstVue: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 5,
  },
  bulletItemVue: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  bulletPointVue: {
    fontSize: 8,
    color: "grey",
    marginRight: 5,
  },
  bulletTextVue: {
    flex: 1,
    fontSize: 14,
  },
  bulletTextblueVue: {
    flex: 1,
    fontSize: 14,
    color: "blue",
  },
  rectangleContainerVue: {
    backgroundColor: "#f8f8f8",
    padding: 20,
    marginTop: 10,
  },
  rectangleTitleVue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },
  rectangleTextVue: {
    fontSize: 16,
    color: "grey",
    textAlign: "left",
  },
  customContentVue: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  graphContainerVue: {
    marginBottom: 0,
    marginLeft: -20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PerformancePage;
