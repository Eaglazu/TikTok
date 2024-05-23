import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Button,
} from "react-native";
import useStore from "./useStore";

const ButtonsPage = ({ navigation }) => {
  const {
    modalVisible,
    currentQuestionIndex,
    questions,
    inputValue,
    setInputValue,
    handleSubmit,
    setCurrentQuestionIndex,
    setModalVisible,
    setSelection,
    selection,
  } = useStore();

  const buttonStyles = [
    { backgroundColor: "#FF6347", title: "Donnée Dash 1" },
    { backgroundColor: "#4682B4", title: "Donnée Dash 2" },
    { backgroundColor: "#32CD32", title: "Donnée Dash 3" },
    { backgroundColor: "#FFD700", title: "Donnée Dash 4" },
  ];

  const handleOptionSelect = (key, value) => {
    setSelection(key, value);
  };

  return (
    <View style={styles.container}>
      {buttonStyles.map((style, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, { backgroundColor: style.backgroundColor }]}
          onPress={() => {
            if (index === 0) setModalVisible(true);
            else console.log(`${style.title} cliqué`);
          }}
        >
          <Text style={styles.buttonText}>{style.title}</Text>
        </TouchableOpacity>
      ))}
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
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.questionText}>
              {questions[currentQuestionIndex]?.text || "Question"}
            </Text>

            {["publicationPercent", "followerPercent", "likesPercent"].includes(
              questions[currentQuestionIndex]?.stateKey
            ) && (
              <View style={styles.optionContainer}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    selection[questions[currentQuestionIndex].stateKey] ===
                      "+" && styles.selectedOptionButton,
                  ]}
                  onPress={() =>
                    handleOptionSelect(
                      questions[currentQuestionIndex].stateKey,
                      "+"
                    )
                  }
                >
                  <Text style={styles.optionButtonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    selection[questions[currentQuestionIndex].stateKey] ===
                      "-" && styles.selectedOptionButton,
                  ]}
                  onPress={() =>
                    handleOptionSelect(
                      questions[currentQuestionIndex].stateKey,
                      "-"
                    )
                  }
                >
                  <Text style={styles.optionButtonText}>-</Text>
                </TouchableOpacity>
              </View>
            )}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 15,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
    marginVertical: 10,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
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
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: "black",
  },
  questionText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: 200,
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 15,
  },
  optionButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedOptionButton: {
    backgroundColor: "#ccc",
  },
  optionButtonText: {
    fontSize: 18,
  },
});

export default ButtonsPage;
