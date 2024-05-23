import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomChart7days from "../components/CustomChart/7days";
import CustomChart30days from "../components/CustomChart/30days";
import ChartDepuisLe from "../components/CustomChart/Depuis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { Modal } from "react-native";
import NumberGrid from "../screens/NumberGrid";
import useStore from "./usestoreD2";

function formatNumber(num) {
  if (isNaN(num) || num === 0) return "0M";
  if (num < 1000) return `${num}`;
  if (num >= 1000 && num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  return `${(num / 1000000).toFixed(2)}M`;
}

const initialSelectedOption = "7 jours";
const VIEWS_PER_EURO = 3003;

const Dash2 = () => {
  const [lastPaymentDate, setLastPaymentDate] = useState(
    getLastDayOfSecondPreviousMonth()
  );
  const currentEarnings = useStore((state) => state.currentEarnings);
  const dataPoints7Days = useStore((state) => state.dataPoints7Days);
  const dataPoints30Days = useStore((state) => state.dataPoints30Days);
  const validateInput = useStore((state) => state.validateInput);
  const setInputValueInStore = useStore((state) => state.setInputValue);
  const setDataPoints30DaysInStore = useStore(
    (state) => state.setDataPoints30Days
  );

  const [inputValue, setInputValue] = useState("");

  function getLastDayOfSecondPreviousMonth() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    date.setDate(0);
    return date.toLocaleDateString("fr-FR");
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLastPaymentDate(getLastDayOfSecondPreviousMonth());
    }, 2592000000);

    return () => clearInterval(interval);
  }, []);

  const route = useRoute();
  console.log("Route params:", route.params);

  const navigation = useNavigation();
  const handleRPMPress = () => {
    navigation.navigate("RPM", { selectedTab: "RPM" });
  };

  const handleInputChange = (text) => {
    setInputValue(text.replace(/[^0-9]/g, ""));
  };

  const handleSubmit = () => {
    setInputValueInStore(inputValue); // Assurez-vous de synchroniser la valeur d'entrée avec le store
    validateInput();
  };

  const { newValue } = route.params || { newValue: null };

  const [selectedOption, setSelectedOption] = useState(initialSelectedOption);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const scrollViewRef = useRef(null);

  const onDateChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
    if (Platform.OS === "ios") setDatePickerVisible(false);
  };

  const onDateChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
    if (Platform.OS === "ios") setDatePickerVisible(false);
  };

  const handleModalVisible = (visible) => {
    setDatePickerVisible(visible);
    if (visible) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleCloseModal = () => {
    handleModalVisible(false);
    scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  const [dataLoaded, setDataLoaded] = useState(false);
  const [isContentReady, setContentReady] = useState(false);
  useEffect(() => {
    if (isContentReady && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  }, [isContentReady]);

  useEffect(() => {
    if (selectedOption === "Périodes") {
      console.log(
        "Selected 'Périodes', DatePicker should be visible:",
        datePickerVisible
      );
    }
  }, [selectedOption, datePickerVisible]);

  const getRelevantDates = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const sevenDaysAgoFromYesterday = new Date(yesterday);
    sevenDaysAgoFromYesterday.setDate(sevenDaysAgoFromYesterday.getDate() - 6);

    const dateFormat = { day: "numeric", month: "long", year: "numeric" };
    return {
      yesterday: yesterday.toLocaleDateString("fr-FR", dateFormat),
      sevenDaysAgoFromYesterday: sevenDaysAgoFromYesterday.toLocaleDateString(
        "fr-FR",
        dateFormat
      ),
    };
  };

  const { yesterday, sevenDaysAgoFromYesterday } = getRelevantDates();
  const [dataPointsDepuis, setDataPointsDepuis] = useState([]);
  const [previous7Days, setPrevious7Days] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  const loadData = async () => {
    try {
      const storedDataPoints7Days = await AsyncStorage.getItem(
        "dataPoints7Days"
      );
      const storedDataPoints30Days = await AsyncStorage.getItem(
        "dataPoints30Days"
      );
      const storedSelectedOption = await AsyncStorage.getItem("selectedOption");
      if (storedDataPoints7Days !== null) {
        setDataPoints7Days(JSON.parse(storedDataPoints7Days));
      }
      if (storedDataPoints30Days !== null) {
        setDataPoints30DaysInStore(JSON.parse(storedDataPoints30Days));
      }
      if (storedSelectedOption !== null) {
        setSelectedOption(storedSelectedOption);
      }
    } catch (error) {
      console.error("Failed to load data", error);
    }
  };

  const saveData = useCallback(
    async (newDataPoints7Days, newDataPoints30Days) => {
      try {
        await AsyncStorage.setItem(
          "dataPoints7Days",
          JSON.stringify(newDataPoints7Days)
        );
        await AsyncStorage.setItem(
          "dataPoints30Days",
          JSON.stringify(newDataPoints30Days)
        );
      } catch (error) {
        console.error("Failed to save data", error);
      }
    },
    []
  );

  const onRefresh = () => {
    setRefreshing(true);
    const now = Date.now();
    if (now - lastUpdateTime >= 60000) {
      updateDataPoints7Days();
      updateDataPoints30Days();
    }
    setRefreshing(false);
  };

  const lastValue = useRef(null);

  useEffect(() => {
    const newEntry = parseFloat(route.params?.newValue);
    if (!isNaN(newEntry) && newEntry !== lastValue.current) {
      lastValue.current = newEntry;
    }
  }, [route.params?.newValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      Alert.alert(
        "Mise à jour nécessaire",
        "Veuillez mettre à jour la dernière valeur des données pour les 7 jours.",
        [{ text: "OK", onPress: () => navigation.navigate("DashScreen") }]
      );
    }, 82800000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateDateLabels = () => {
      const newDateLabels = generateDateLabels30Days();
      setDateLabels30Days(newDateLabels);
    };

    updateDataPoints30Days();
    updateDateLabels();

    const intervalId = setInterval(() => {
      updateDataPoints30Days();
      updateDateLabels();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [selectedOption]);

  useEffect(() => {
    const rawViews7Days = dataPoints7Days.reduce(
      (acc, curr) => acc + Math.floor(curr * VIEWS_PER_EURO),
      0
    );
    setViewsEligible7Days(formatNumber(rawViews7Days));

    const rawViews30Days = dataPoints30Days.reduce(
      (acc, curr) => acc + Math.floor(curr * VIEWS_PER_EURO),
      0
    );
    setViewsEligible30Days(formatNumber(rawViews30Days));

    const rawViewsDepuis = dataPointsDepuis.reduce(
      (acc, curr) => acc + Math.floor(curr * VIEWS_PER_EURO),
      0
    );
    setViewsEligibleDepuis(formatNumber(rawViewsDepuis));
  }, [dataPoints7Days, dataPoints30Days, dataPointsDepuis]);

  useEffect(() => {
    console.log("Updated Views Eligible:", setViewsEligible7Days);
  }, [setViewsEligible7Days]);

  useEffect(() => {
    const newDateLabels30Days = generateDateLabels30Days();
    setDateLabels30Days(newDateLabels30Days);
    updateDataPoints30Days();
  }, [dataPoints7Days]);

  const [viewsEligible7Days, setViewsEligible7Days] = useState(
    formatNumber(
      dataPoints7Days.reduce(
        (acc, curr) => acc + Math.floor(curr * VIEWS_PER_EURO),
        0
      )
    )
  );
  const [viewsEligible30Days, setViewsEligible30Days] = useState(
    formatNumber(
      dataPoints30Days.reduce(
        (acc, curr) => acc + Math.floor(curr * VIEWS_PER_EURO),
        0
      )
    )
  );
  const [viewsEligibleDepuis, setViewsEligibleDepuis] = useState(
    formatNumber(
      dataPointsDepuis.reduce(
        (acc, curr) => acc + Math.floor(curr * VIEWS_PER_EURO),
        0
      )
    )
  );

  useEffect(() => {
    setViewsEligible7Days(
      formatNumber(
        dataPoints7Days.reduce(
          (acc, curr) => acc + Math.floor(curr * VIEWS_PER_EURO),
          0
        )
      )
    );
    setViewsEligible30Days(
      formatNumber(
        dataPoints30Days.reduce(
          (acc, curr) => acc + Math.floor(curr * VIEWS_PER_EURO),
          0
        )
      )
    );
    setViewsEligibleDepuis(
      formatNumber(
        dataPointsDepuis.reduce(
          (acc, curr) => acc + Math.floor(curr * VIEWS_PER_EURO),
          0
        )
      )
    );
  }, [dataPoints7Days, dataPoints30Days, dataPointsDepuis]);

  const [rawViewsEligible, setRawViewsEligible] = useState(0);
  const [previous30Days, setPrevious30Days] = useState([]);

  const getCurrentViewsEligible = () => {
    switch (selectedOption) {
      case "7 jours":
        return viewsEligible7Days;
      case "30 jours":
        return viewsEligible30Days;
      case "Depuis le...":
        return viewsEligibleDepuis;
      default:
        return "0M";
    }
  };

  useEffect(() => {
    const initialViews = dataPoints7Days.reduce(
      (acc, curr) => acc + Math.floor(curr * VIEWS_PER_EURO),
      0
    );
    setViewsEligible7Days(formatNumber(initialViews));
  }, [dataPoints7Days]);

  const generateDateLabels = () => {
    const today = new Date();
    const dateFormat = { day: "2-digit", month: "2-digit" };
    return Array.from({ length: 7 }, (v, i) => {
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - i
      );
      return date.toLocaleDateString("fr-FR", dateFormat);
    }).reverse();
  };

  const generateDateLabels30Days = () => {
    const today = new Date();
    const dateFormat = { day: "2-digit", month: "2-digit" };
    let dates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - i
      );
      dates.push(date.toLocaleDateString("fr-FR", dateFormat));
    }
    return dates.reverse();
  };

  const [dateLabels30Days, setDateLabels30Days] = useState(
    generateDateLabels30Days()
  );
  const [dateLabels, setDateLabels] = useState(generateDateLabels());

  const getBottomDatesForLabels30 = () => {
    const now = new Date();
    now.setDate(now.getDate() - 1);

    let bottomDates = [];
    for (let i = 29; i >= 0; i -= 5) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      bottomDates.push(
        date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
      );
    }
    return bottomDates;
  };
  const newBottomDateLabels = getBottomDatesForLabels30();
  const generateMonthLabels = () => {
    const today = new Date();
    let labels = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      labels.push(
        monthDate.toLocaleDateString("fr-FR", {
          month: "short",
        })
      );
    }
    return labels;
  };

  const allMonthLabels = generateMonthLabels();
  const getBottomDatesForLabelsA = () => {
    const today = new Date();
    let labels = [];
    for (let i = 0; i < 7; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      labels.push(
        monthDate.toLocaleDateString("fr-FR", {
          month: "short",
        })
      );
    }
    return labels.reverse();
  };

  const newBottomDateLabelsA = getBottomDatesForLabelsA();
  const monthLabels = generateMonthLabels();

  const MAX_DATA_POINTS = 7;

  const updateDataPoints7Days = useCallback(
    (newEntry) => {
      setDataPoints7Days((prevData) => {
        const newData =
          prevData.length >= MAX_DATA_POINTS
            ? [...prevData.slice(1), newEntry]
            : [...prevData, newEntry];
        setPrevious7Days(prevData);

        const newRawViews = newData.reduce(
          (acc, curr) => acc + Math.floor(curr * VIEWS_PER_EURO),
          0
        );
        setRawViewsEligible(newRawViews);

        return newData;
      });

      setLastUpdateTime(Date.now());
      saveData();
    },
    [setPrevious7Days, setRawViewsEligible, saveData]
  );

  const updateDataPoints30Days = useCallback(() => {
    const today = new Date();
    const newDateLabels = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - i
      );
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      });
    }).reverse();

    let newData = [
      ...dataPoints30Days.slice(0, -7),
      ...dataPoints7Days.slice(-7),
    ];
    const newRawViews = newData.reduce(
      (acc, curr) => acc + Math.floor(curr * VIEWS_PER_EURO),
      0
    );
    const formattedViews = formatNumber(newRawViews);

    setDataPoints30DaysInStore(newData);
    setDateLabels30Days(newDateLabels);
    setPrevious30Days(dataPoints30Days);
    setViewsEligible30Days(formattedViews);
  }, [
    dataPoints30Days,
    dataPoints7Days,
    setPrevious30Days,
    setViewsEligible30Days,
    setDateLabels30Days,
  ]);

  const generateDataPointsDepuis = () => {
    let targetValue = 8100;
    let variation = 500;

    let newValues = Array.from({ length: 11 }, () => {
      let min = targetValue - variation;
      let max = targetValue + variation;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    });

    let sumLast30Days = dataPoints30Days.reduce((acc, curr) => acc + curr, 0);
    newValues.push(sumLast30Days);

    setDataPointsDepuis(newValues);
  };

  useEffect(() => {
    generateDataPointsDepuis();

    const interval = setInterval(() => {
      generateDataPointsDepuis();
    }, 2592000000);

    return () => clearInterval(interval);
  }, [dataPoints30Days]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === "Périodes") {
      setDatePickerVisible(true);
    } else {
      setDatePickerVisible(false);
    }
  };

  const getTotalSum = (option) => {
    switch (option) {
      case "7 jours":
        return dataPoints7Days.reduce((acc, val) => acc + val, 0).toFixed(2);
      case "30 jours":
        return dataPoints30Days.reduce((acc, val) => acc + val, 0).toFixed(2);
      case "Depuis le...":
        return dataPointsDepuis.reduce((acc, val) => acc + val, 0).toFixed(2);
      default:
        return "0.00";
    }
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={datePickerVisible}
        onRequestClose={() => {
          setDatePickerVisible(!datePickerVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{ alignSelf: "flex-end", margin: 10 }}
              onPress={() => setDatePickerVisible(false)}
            >
              <Image
                source={require("../assets/images/closes.png")}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>

            <View style={styles.daysOfWeekContainer}>
              <Text style={styles.dayOfWeek}>dim</Text>
              <Text style={styles.dayOfWeek}>lun</Text>
              <Text style={styles.dayOfWeek}>mar</Text>
              <Text style={styles.dayOfWeek}>mer</Text>
              <Text style={styles.dayOfWeek}>jeu</Text>
              <Text style={styles.dayOfWeek}>ven</Text>
              <Text style={styles.dayOfWeek}>sam</Text>
            </View>
            <View style={styles.divider}></View>

            <ScrollView ref={scrollViewRef} style={styles.scrollView}>
              <View
                onLayout={() => setContentReady(true)}
                style={styles.content}
              >
                <NumberGrid month={5} year={2024} />
              </View>
            </ScrollView>

            <View style={styles.dividerBas}></View>

            <View style={styles.contentBelow}>
              <View style={styles.datesContainer}>
                <Text style={styles.dateText}>{sevenDaysAgoFromYesterday}</Text>
                <Text style={styles.dateTextslide}> - </Text>
                <Text style={styles.dateText}>{yesterday}</Text>
              </View>
              <TouchableOpacity
                onPress={() => console.log("Terminé appuyé")}
                style={styles.doneButton}
              >
                <Text style={styles.doneButtonText}>Terminé</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        <View style={styles.optionsContainer}>
          {["7 jours", "30 jours", "Depuis le...", "Périodes"].map(
            (option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleOptionSelect(option)}
                style={[
                  styles.option,
                  selectedOption === option && styles.selectedOptionText,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === option && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            )
          )}
          <Image
            source={require("../assets/images/chevronBas.png")}
            style={styles.calendarIcon}
          />
        </View>
        <View style={styles.estimatedRewardsContainer}>
          <Text style={styles.estimatedRewardsText}>Récompenses estimées</Text>

          <Image
            source={require("../assets/images/info.png")}
            style={styles.rewardsImage}
          />
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.largeAmountText}>
            €{getTotalSum(selectedOption)}
          </Text>
        </View>
        {selectedOption === "7 jours" && (
          <CustomChart7days
            key={Date.now()}
            dataPoints={dataPoints7Days}
            dateLabels={dateLabels}
          />
        )}
        {selectedOption === "30 jours" && (
          <CustomChart30days
            key={Date.now()}
            dataPoints={dataPoints30Days}
            dateLabels={dateLabels30Days}
            bottomDateLabels={newBottomDateLabels}
          />
        )}
        {selectedOption === "Depuis le..." && (
          <ChartDepuisLe
            dataPoints={dataPointsDepuis}
            dateLabels={monthLabels}
            bottomDateLabels={newBottomDateLabelsA}
          />
        )}
        {selectedOption === "Périodes" && datePickerVisible && (
          <>
            <DateTimePicker
              testID="dateTimePickerStart"
              value={startDate}
              mode="date"
              display="default"
              onChange={onDateChangeStart}
            />
            <DateTimePicker
              testID="dateTimePickerEnd"
              value={endDate}
              mode="date"
              display="default"
              onChange={onDateChangeEnd}
            />
          </>
        )}
        <View style={styles.squareContainer}>
          <TouchableOpacity style={styles.square}>
            <Text style={styles.squareText}>Vues éligible: </Text>
            <Text style={styles.valueText}>
              {selectedOption === "7 jours"
                ? viewsEligible7Days
                : selectedOption === "30 jours"
                ? viewsEligible30Days
                : viewsEligibleDepuis}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRPMPress} style={styles.square}>
            <Text style={styles.squareText}>RPM</Text>
            <Text style={styles.valueText}>€0.48</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.newsRectangle}>
          <View style={styles.headerWithButton}>
            <View style={styles.newsHeader}>
              <Text style={styles.newsTitle}>Dernier paiement</Text>
              <Image
                source={require("../assets/images/info.png")}
                style={styles.paymentIcon}
              />
            </View>
            <TouchableOpacity style={styles.balanceButton}>
              <Text style={styles.balanceButtonText}>Voir le solde</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.valueTextsolde}>€1200.00</Text>
          <Text style={styles.newsContent}>Créditée le {lastPaymentDate}</Text>
        </View>
        <View style={styles.videosRecentesContainerVideo}>
          <View style={styles.headerVideo}>
            <Text style={styles.headerTitleVideo}>Vidéos récentes</Text>
            <Image
              source={require("../assets/images/info.png")}
              style={styles.videoIconVideo}
            />
          </View>
          <Text style={styles.descriptionTextVideo}>
            Afficher les vidéos (de plus d'une minute) en fonction de l'heure de
            leur publication.
          </Text>

          <View style={styles.buttonsContainerVideo}>
            <TouchableOpacity style={styles.buttonLargeVideo}>
              <Text style={styles.buttonTextVideo}>
                Date de publications (la plus récente)
              </Text>
              <Image
                source={require("../assets/images/chevronBas.png")}
                style={styles.videoImage}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSmallVideo}>
              <Text style={styles.buttonTextSmallVideo}>Toutes le</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={handleInputChange}
          keyboardType="numeric"
          placeholder="Entrez un nombre"
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.doneButton}>
          <Text style={styles.doneButtonText}>Valider</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: "#ededed",
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  headerText: {
    fontFamily: "HelveticaNeue",
    fontSize: 11,
    color: "#808080",
    fontWeight: "bold",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ededed",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    paddingVertical: 5,
  },
  option: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  optionText: {
    fontFamily: "HelveticaNeue",
    color: "grey",
    fontSize: 12,
  },
  selectedOptionText: {
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },

  calendarIcon: {
    width: 12,
    height: 12,
    marginTop: 10,
    marginRight: 8,
    marginLeft: 2,
  },
  estimatedRewardsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  estimatedRewardsText: {
    fontFamily: "HelveticaNeue",
    fontSize: 16,
    color: "black",
    marginRight: 5,
  },
  rewardsImage: {
    width: 14,
    height: 14,
  },
  messageContainer: {
    marginTop: 5,
    alignItems: "center",
  },
  largeAmountText: {
    fontFamily: "HelveticaNeue",
    fontSize: 22,
    color: "black",
  },
  percentageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  percentageIcon: {
    width: 13,
    height: 13,
    marginRight: 5,
  },
  percentageText: {
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    color: "#808080",
  },
  squareContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    marginHorizontal: 10,
    marginTop: 20,
    paddingTop: 10,
  },
  square: {
    width: "45%",
    backgroundColor: "#ededed",
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 15,
  },
  squareContent: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  squareText: {
    fontFamily: "HelveticaNeue",
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    marginBottom: 5,
  },
  valueText: {
    fontFamily: "HelveticaNeue",
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  valueTextsolde: {
    fontFamily: "HelveticaNeue",
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    marginTop: -22,
  },
  newsRectangle: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  headerWithButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  newsHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginRight: 5,
    marginTop: -30,
  },
  paymentIcon: {
    width: 13,
    height: 13,
    tintColor: "#808080",
    marginRight: 10,
    marginTop: -28,
  },
  newsContent: {
    fontSize: 14,
    color: "grey",
    marginTop: 1,
  },
  balanceButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 5,
  },
  balanceButtonText: {
    color: "#808080",
    fontSize: 14,
  },
  videosRecentesContainerVideo: {
    backgroundColor: "white",
    padding: 15,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  headerVideo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitleVideo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginRight: 10,
  },
  videoIconVideo: {
    width: 13,
    height: 13,
  },
  descriptionTextVideo: {
    fontSize: 14,
    color: "grey",
    marginBottom: 5,
  },
  buttonsContainerVideo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 5,
    paddingLeft: 0,
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 10,
  },
  buttonLargeVideo: {
    backgroundColor: "#ededed",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexGrow: 1,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: -14,
  },
  buttonSmallVideo: {
    backgroundColor: "#ededed",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    marginLeft: 5,
  },
  buttonTextVideo: {
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  videoImage: {
    marginLeft: 10,
    width: 12,
    height: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "100%",
    height: "95%",
    marginTop: "auto",
    marginBottom: 0,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    shadowColor: "",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  daysOfWeekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 10,
  },
  dayOfWeek: {
    fontFamily: "HelveticaNeue",
    fontSize: 15,
    color: "grey",
  },
  divider: {
    position: "absolute",
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    marginTop: 105,
    marginBottom: 10,
  },
  scrollableViewCalendar: {
    flex: 1,
    maxHeight: "70%",
  },
  monthSpace: {
    height: 10,
  },
  monthName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  daysContainer: {
    flexDirection: "column",
    marginBottom: 20,
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  day: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
  },
  contentBelow: {
    padding: 20,
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "grey",
    marginBottom: 10,
  },
  doneButton: {
    marginTop: 20,
    backgroundColor: "red",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: "110%",
    alignItems: "center",
    alignSelf: "center",
  },
  doneButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  datesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
  },
  dateText: {
    fontSize: 16,
    color: "black",
    marginHorizontal: 3,
  },
  dateTextslide: {
    fontSize: 17,
    color: "black",
    marginHorizontal: 2,
  },
  dividerBas: {
    marginLeft: -40,
    height: 1,
    backgroundColor: "grey",
    marginVertical: 4,
    width: "1400%",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginVertical: 20,
  },
});

export default Dash2;
