import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useStore from "./useStore";

const screenWidth = Dimensions.get("window").width;

const DashScreenTopTabs = () => {
  return (
    <View style={styles.tabsContainer}>
      <View style={styles.toolTab}>
        <Text style={styles.tabText}>Outils</Text>
        <View style={styles.underline} />
      </View>
      <Text style={styles.tabText}>LIVE</Text>
    </View>
  );
};

const DashScreen = ({ navigation }) => {
  const {
    publicationViews,
    publicationPercent,
    followers,
    followerPercent,
    likes,
    likesPercent,
    lastPublicationViews,
    lastPublicationLikes,
    currentEarnings,
    modalVisible,
    setModalVisible,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    buttonVisible,
    setButtonVisible,
    handleSubmit,
    setInputValue,
    inputValue,
    questions,
    dataPoints7Days,
    selection,
    setSelection,
  } = useStore();

  const [totalSum7Days, setTotalSum7Days] = useState(0);

  useEffect(() => {
    const checkSubmissionTime = async () => {
      try {
        const lastSubmissionTime = await AsyncStorage.getItem(
          "lastSubmissionDate"
        );
        if (lastSubmissionTime) {
          const lastTime = new Date(lastSubmissionTime).getTime();
          const currentTime = new Date().getTime();
          setButtonVisible(currentTime - lastTime > 2000);
        }
      } catch (error) {
        console.error("Error fetching last submission time:", error);
      }
    };
    checkSubmissionTime();
  }, []);

  useEffect(() => {
    console.log("Publication Views:", publicationViews);
    console.log("Publication Percent:", publicationPercent);
    console.log("Followers:", followers);
    console.log("Follower Percent:", followerPercent);
    console.log("Likes:", likes);
    console.log("Likes Percent:", likesPercent);
    console.log("Last Publication Views:", lastPublicationViews);
    console.log("Last Publication Likes:", lastPublicationLikes);
    console.log("Current Earnings:", currentEarnings);
  }, [
    publicationViews,
    publicationPercent,
    followers,
    followerPercent,
    likes,
    likesPercent,
    lastPublicationViews,
    lastPublicationLikes,
    currentEarnings,
  ]);

  useEffect(() => {
    const calculateTotalSum7Days = () => {
      const sum = dataPoints7Days.reduce((acc, val) => acc + val, 0);
      setTotalSum7Days(sum.toFixed(2));
    };
    calculateTotalSum7Days();
  }, [dataPoints7Days]);

  function formatNumberWithDecimals(num, suffix) {
    return num % 1 === 0
      ? num + suffix
      : num.toString().replace(".", ",") + suffix;
  }

  function formatNumber(num) {
    if (num < 1000) {
      return formatNumberWithDecimals(num, "K");
    } else if (num >= 1000) {
      return formatNumberWithDecimals((num / 1000).toFixed(1), "M");
    } else {
      return num.toString();
    }
  }

  function formatfollows(num) {
    if (num < 1000) {
      return num.toString();
    } else if (num < 1000000) {
      return formatNumberWithDecimals((num / 1000).toFixed(1), "K");
    } else {
      return formatNumberWithDecimals((num / 1000000).toFixed(1), "M");
    }
  }

  function formatLikes(likes) {
    if (likes > 1000) {
      return formatNumberWithDecimals((likes / 1000).toFixed(1), "K");
    } else {
      return likes.toString();
    }
  }

  function formatPercentage(percent) {
    return percent.toFixed(1).replace(".", ",");
  }
  function formatNumberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const goToDash1 = () => {
    navigation.navigate("Dash1", { newValue: parseInt(inputValue, 10) });
  };

  const handleSelection = (key, value) => {
    setSelection(key, value);
  };

  const getImageForKey = (key) => {
    if (selection[key] === "+") {
      return require("../assets/images/flecheTop.png");
    } else if (selection[key] === "-") {
      return require("../assets/images/flecheDown.png");
    } else {
      return null;
    }
  };

  const isSelectedPlusOption = (key) => {
    return selection[key] === "+";
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            setCurrentQuestionIndex(0);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                  setCurrentQuestionIndex(0);
                }}
              >
                <Image
                  source={require("../assets/images/closes.png")}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>

              <Text style={styles.questionText}>
                {questions[currentQuestionIndex].text}
              </Text>

              {questions[currentQuestionIndex].stateKey ===
                "publicationPercent" ||
              questions[currentQuestionIndex].stateKey === "followerPercent" ||
              questions[currentQuestionIndex].stateKey === "likesPercent" ? (
                <View style={styles.selectionContainer}>
                  <TouchableOpacity
                    style={[
                      styles.selectionButton,
                      selection[questions[currentQuestionIndex].stateKey] ===
                        "+" && styles.selectedButton,
                    ]}
                    onPress={() =>
                      handleSelection(
                        questions[currentQuestionIndex].stateKey,
                        "+"
                      )
                    }
                  >
                    <Text style={styles.selectionButtonText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.selectionButton,
                      selection[questions[currentQuestionIndex].stateKey] ===
                        "-" && styles.selectedButton,
                    ]}
                    onPress={() =>
                      handleSelection(
                        questions[currentQuestionIndex].stateKey,
                        "-"
                      )
                    }
                  >
                    <Text style={styles.selectionButtonText}>-</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              <TextInput
                style={styles.input}
                onChangeText={setInputValue}
                value={inputValue}
                keyboardType="numeric"
                placeholder="Entrez votre réponse ici"
              />
              <Button
                title="Soumettre"
                onPress={() => {
                  console.log("Bouton Soumettre pressé");
                  handleSubmit();
                  if (currentQuestionIndex >= questions.length - 1) {
                    setModalVisible(false);
                    setCurrentQuestionIndex(0);
                  } else {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  }
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.container}>
        <DashScreenTopTabs />
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionText}>Données analytiques</Text>
          <View style={styles.showAllContainer}>
            <Text style={styles.showAllText}>Tout afficher</Text>
            <Image
              style={styles.arrowIcon}
              source={require("../assets/images/suivant.png")}
            />
          </View>
        </View>
        <View style={styles.squareContainer}>
          <View style={styles.squareWithText}>
            <Text style={styles.bigNumber}>
              {formatNumber(publicationViews)}
            </Text>
            <Text style={styles.subText}>Vues de publication</Text>
            <View style={styles.inlineContainer}>
              <Image
                style={
                  isSelectedPlusOption("publicationPercent")
                    ? styles.imgsquareblue
                    : styles.imgsquare
                }
                source={getImageForKey("publicationPercent")}
              />
              <Text
                style={
                  isSelectedPlusOption("publicationPercent")
                    ? styles.percentageBlue
                    : styles.percentage
                }
              >
                {formatPercentage(publicationPercent)}%
              </Text>
              <Text style={styles.daysText}>7j</Text>
            </View>
          </View>
          <View style={styles.squareWithText}>
            <Text style={styles.bigNumber}>{formatfollows(followers)}</Text>
            <Text style={styles.subText}>Followers nets</Text>
            <View style={styles.inlineContainer}>
              <Image
                style={
                  isSelectedPlusOption("followerPercent")
                    ? styles.imgsquareblue
                    : styles.imgsquare
                }
                source={getImageForKey("followerPercent")}
              />
              <Text
                style={
                  isSelectedPlusOption("followerPercent")
                    ? styles.percentageBlue
                    : styles.percentage
                }
              >
                {formatPercentage(followerPercent)}%
              </Text>
              <Text style={styles.daysText}>7j</Text>
            </View>
          </View>
          <View style={styles.squareWithText}>
            <Text style={styles.bigNumber}>{formatLikes(likes)}</Text>
            <Text style={styles.subText}>J'aime</Text>
            <View style={styles.inlineContainer}>
              <Image
                style={
                  isSelectedPlusOption("likesPercent")
                    ? styles.imgsquareblue
                    : styles.imgsquare
                }
                source={getImageForKey("likesPercent")}
              />
              <Text
                style={
                  isSelectedPlusOption("likesPercent")
                    ? styles.percentageBlue
                    : styles.percentage
                }
              >
                {formatPercentage(likesPercent)}%
              </Text>
              <Text style={styles.daysText}>7j</Text>
            </View>
          </View>
        </View>
        <View style={styles.largeRectangle}>
          <Text style={styles.largeRectangleText}>Ta dernière publication</Text>
          <View style={styles.largeRectangleRightContent}>
            <View style={[styles.itemWithIcon, { marginLeft: 20 }]}>
              <Image
                style={styles.imgsrect}
                source={require("../assets/images/flecheRight.png")}
              />
              <Text style={styles.largeRectangleNumbers}>
                {formatNumberWithCommas(lastPublicationViews)}
              </Text>
            </View>
            <View style={[styles.itemWithIcon, { marginRight: 10 }]}>
              <Image
                style={styles.imgsrect}
                source={require("../assets/images/Like.png")}
              />
              <Text style={styles.largeRectangleNumbers}>
                {formatLikes(lastPublicationLikes)}
              </Text>
            </View>
            <Image
              style={[styles.arrowIcon, { marginLeft: 55 }]}
              source={require("../assets/images/suivant.png")}
            />
            <Text style={styles.largeRectangleArrow}></Text>
          </View>
        </View>
        <View style={styles.thinRectangle} />
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionText}>Monétisation</Text>
          <View style={styles.showAllContainer}>
            <Text style={styles.showAllText}>Tout afficher</Text>
            <Image
              style={styles.arrowIcon}
              source={require("../assets/images/suivant.png")}
            />
          </View>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.monetizationSquaresContainer}
        >
          <View style={styles.monetizationSquareContainer}>
            <TouchableOpacity
              onPress={goToDash1}
              style={styles.monetizationSquare}
            >
              <Image
                style={styles.monetizationSquareImagedollars}
                source={require("../assets/images/4branches.png")}
              />
            </TouchableOpacity>
            <Text style={styles.monetizationSquareText}>Programme</Text>
            <Text style={styles.monetizationSquareText}>de</Text>
            <Text style={styles.monetizationSquareText}>Récompens</Text>
          </View>
          <View style={styles.monetizationSquareContainer}>
            <View style={styles.monetizationSquare}>
              <Image
                style={styles.monetizationSquareImage}
                source={require("../assets/images/music.png")}
              />
            </View>
            <Text style={styles.monetizationSquareText}>Travailler avec</Text>
            <Text style={styles.monetizationSquareText}>les artistes</Text>
          </View>
          <View style={styles.monetizationSquareContainer}>
            <View style={styles.monetizationSquare}>
              <Image
                style={styles.monetizationSquareImage}
                source={require("../assets/images/gift.png")}
              />
            </View>
            <Text style={styles.monetizationSquareText}>Cadeaux</Text>
            <Text style={styles.monetizationSquareText}>video</Text>
          </View>
          <View style={styles.monetizationSquareContainer}>
            <View style={styles.monetizationSquare}>
              <Image
                style={styles.monetizationSquareImage}
                source={require("../assets/images/sub.png")}
              />
            </View>
            <Text style={styles.monetizationSquareText}>Abonnement</Text>
          </View>
          <View style={styles.monetizationSquareContainer}>
            <View style={styles.monetizationSquare}>
              <Image
                style={styles.monetizationSquareImage}
                source={require("../assets/images/gift.png")}
              />
            </View>
            <Text style={styles.monetizationSquareText}>Séries</Text>
          </View>
          <View style={styles.monetizationSquareContainer}>
            <View style={styles.monetizationSquare}>
              <Image
                style={styles.monetizationSquareImage}
                source={require("../assets/images/gift.png")}
              />
            </View>
            <Text style={styles.monetizationSquareText}>Cadeaux LIVE</Text>
          </View>
          <View style={styles.monetizationSquareContainer}>
            <View style={styles.monetizationSquare}>
              <Image
                style={styles.monetizationSquareImage}
                source={require("../assets/images/creator.png")}
              />
            </View>
            <Text style={styles.monetizationSquareText}>Creator</Text>
            <Text style={styles.monetizationSquareText}>Marketplace</Text>
          </View>
        </ScrollView>
        <View style={styles.additionalRectangle}>
          <Text style={styles.additionalRectangleTextSmaller}>
            Récompenses estimées (7 derniers jours) :
          </Text>
          <Text style={styles.totalSumText}>${totalSum7Days}</Text>
          <View style={styles.additionalRectangleRightContentSmaller}>
            <Image
              style={styles.arrowIconSmaller}
              source={require("../assets/images/suivant.png")}
            />
          </View>
        </View>

        <View style={styles.sectionContaineroutils}>
          <Text style={styles.sectionText}>Plus d'outils</Text>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.monetizationSquaresContainer}
        >
          <View style={styles.monetizationSquareContainer}>
            <View style={styles.monetizationSquare}>
              <Image
                style={styles.monetizationSquareImage}
                source={require("../assets/images/user.png")}
              />
            </View>
            <Text style={styles.monetizationSquareText}>Vérification</Text>
            <Text style={styles.monetizationSquareText}>du compte</Text>
          </View>
          <View style={styles.monetizationSquareContainer}>
            <View style={styles.monetizationSquare}>
              <Image
                style={styles.monetizationSquareImage}
                source={require("../assets/images/books.png")}
              />
            </View>
            <Text style={styles.monetizationSquareText}>Creator</Text>
            <Text style={styles.monetizationSquareText}>Academy</Text>
          </View>
          <View style={styles.monetizationSquareContainer}>
            <View style={styles.monetizationSquare}>
              <Image
                style={styles.monetizationSquareImage}
                source={require("../assets/images/fire.png")}
              />
            </View>
            <Text style={styles.monetizationSquareText}>Promouvoir</Text>
          </View>
          <View style={styles.monetizationSquareContainer}>
            <View style={styles.monetizationSquare}>
              <Image
                style={styles.monetizationSquareImage}
                source={require("../assets/images/music.png")}
              />
            </View>
            <Text style={styles.monetizationSquareText}>Centre des</Text>
            <Text style={styles.monetizationSquareText}>Artistes</Text>
          </View>
          <View style={styles.monetizationSquareContainer}>
            <View style={styles.monetizationSquare}>
              <Image
                style={styles.monetizationSquareImage}
                source={require("../assets/images/video.png")}
              />
            </View>
            <Text style={styles.monetizationSquareText}>Liste de</Text>
            <Text style={styles.monetizationSquareText}>lecture</Text>
          </View>
          <View style={styles.monetizationSquareContainer}>
            <View style={styles.monetizationSquare}>
              <Image
                style={styles.monetizationSquareImage}
                source={require("../assets/images/photo.png")}
              />
            </View>
            <Text style={styles.monetizationSquareText}>Ajout perso</Text>
          </View>
        </ScrollView>
        <View style={styles.thinRectangle} />
        <View style={styles.scrollableSpace} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#FAFAFA ",
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  tabsContainer: {
    marginTop: -21,
    fontFamily: "HelveticaNeue",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#ededed",
    paddingHorizontal: 70,
  },
  toolTab: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontFamily: "HelveticaNeue",
    fontWeight: "600",
    fontSize: 18,
    paddingVertical: 10,
  },
  underline: {
    position: "absolute",
    bottom: 0,
    left: -60,
    width: screenWidth / 2 - 20,
    height: 2,
    backgroundColor: "black",
  },
  analyticsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginTop: 20,
  },
  analyticsText: {
    fontFamily: "HelveticaNeue",
    fontSize: 18,
    color: "black",
  },
  showAllText: {
    fontFamily: "HelveticaNeue",
    fontSize: 16,
    color: "grey",
    marginRight: -60,
  },
  squareContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  square: {
    width: screenWidth / 3 - 18,
    height: screenWidth / 3 - 20,
    backgroundColor: "#ededed",
    margin: 10,
  },
  thinRectangle: {
    width: screenWidth - 20,
    height: 10,
    backgroundColor: "#ededed",
    marginTop: 20,
    alignSelf: "center",
  },
  monetizationSquareContainer: {
    alignItems: "center",
    margin: 10,
  },
  monetizationSquare: {
    width: screenWidth / 5 - 15,
    height: screenWidth / 5 - 25,
    backgroundColor: "#ededed",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 10,
  },
  monetizationSquareImage: {
    width: screenWidth / 13,
    height: screenWidth / 13,
  },
  monetizationSquareImagedollars: {
    width: screenWidth / 14,
    height: screenWidth / 14,
    borderRadius: 100,
  },
  monetizationSquareText: {
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    textAlign: "center",
  },
  monetizationSquareTextContainer: {
    fontFamily: "HelveticaNeue",
    marginTop: 3,
    alignItems: "center",
  },
  largeRectangle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: screenWidth - 35,
    height: 50,
    backgroundColor: "#ededed",
    marginTop: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  largeRectangleText: {
    fontFamily: "HelveticaNeue",
    fontSize: 13.5,
    color: "black",
  },
  largeRectangleRightContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  largeRectangleImage: {
    marginLeft: "auto",
  },
  itemWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    tintColor: "grey",
  },
  moreToolsText: {
    fontFamily: "HelveticaNeue",
    fontSize: 18,
    color: "black",
    marginTop: 20,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  moreToolsSquaresContainer: {
    flexDirection: "row",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  moreToolsSquare: {
    width: screenWidth / 4 - 20,
    height: screenWidth / 4 - 20,
    backgroundColor: "#ededed",
    margin: 10,
    borderRadius: 10,
  },
  scrollableSpace: {
    width: screenWidth - 40,
    height: 500,
    marginTop: 20,
    alignSelf: "center",
  },
  squareWithText: {
    fontFamily: "HelveticaNeue",
    width: screenWidth / 3 - 20,
    height: screenWidth / 3 - 20,
    backgroundColor: "#ededed",
    margin: 10,
    padding: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderRadius: 10,
  },
  bigNumber: {
    fontSize: 22,
    color: "black",
    fontWeight: "bold",
    textAlign: "left",
  },
  subText: {
    fontFamily: "HelveticaNeue",
    fontSize: 13.7,
    color: "grey",
    textAlign: "left",
    marginTop: 4,
  },
  percentage: {
    fontFamily: "HelveticaNeue",
    fontSize: 15,
    color: "#2C2C2C",
    textAlign: "left",
    marginTop: 4,
    marginRight: 4,
  },
  inlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  percentageBlue: {
    fontSize: 16,
    color: "#69C9D0",
    marginRight: 4,
  },
  daysText: {
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    color: "#B0B0B0",
  },
  imgsquare: {
    width: 14,
    height: 14,
    marginRight: 5,
  },
  imgsrect: {
    tintColor: "grey",
    width: 14,
    height: 14,
    marginRight: 5,
  },
  imgsquareblue: {
    tintColor: "#69C9D0",
    width: 14,
    height: 14,
    marginRight: 5,
  },
  arrowIcon: {
    tintColor: "grey",
    width: 12,
    height: 12,
  },
  sectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginTop: 20,
  },
  sectionText: {
    fontFamily: "HelveticaNeue",
    fontSize: 18,
    color: "black",
  },
  sectionContaineroutils: {
    width: "90%",
    marginTop: 20,
    alignSelf: "flex-start",
    marginLeft: screenWidth * 0.05,
  },
  showAllContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  showAllText: {
    fontFamily: "HelveticaNeue",
    fontSize: 16,
    color: "grey",
    marginRight: 5,
  },
  additionalRectangle: {
    flexDirection: "row", // Arrange les enfants horizontalement
    justifyContent: "space-between",
    alignItems: "center",
    width: screenWidth - 25,
    height: 40,
    backgroundColor: "#ededed",
    marginTop: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  additionalRectangleTextSmaller: {
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    color: "#000000",
  },
  totalSumText: {
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    color: "#000000",
    marginLeft: "auto", // Push the element to the right
  },
  additionalRectangleRightContentSmaller: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrowIconSmaller: {
    width: 10,
    height: 10,
    tintColor: "grey",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
    position: "relative",
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
  },
  questionText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: 200,
    marginBottom: 15,
  },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  selectionButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginHorizontal: 10,
  },
  selectedButton: {
    backgroundColor: "#ddd",
  },
  selectionButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DashScreen;
