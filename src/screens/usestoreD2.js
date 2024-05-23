import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Fonction pour générer les étiquettes de date pour 7 jours
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

// Fonction pour générer les étiquettes de date pour 30 jours
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

const generateInitialValues30DaysVue = () => {
  const initialValues7Days = [0.45, 0.5, 0.55, 0.48, 0.42, 0.47, 0.53];
  let data = [];
  let lastValue = initialValues7Days[0];
  for (let i = 0; i < 23; i++) {
    let minNewValue = 0.45;
    let maxNewValue = 0.53;
    let newEntry = Math.random() * (maxNewValue - minNewValue) + minNewValue;
    data.push(parseFloat(newEntry.toFixed(2)));
    lastValue = newEntry;
  }
  return data.concat(initialValues7Days);
};

// Fonction pour générer des valeurs initiales pour 30 jours avec des écarts moins grands
const generateInitialValues30Days = () => {
  const initialValues7Days = [357.5, 378.9, 410.2, 275, 125, 433, 434];
  let data = [];
  let lastValue = initialValues7Days[0];
  for (let i = 0; i < 23; i++) {
    let minNewValue = Math.max(lastValue - 47, 324);
    let maxNewValue = Math.min(lastValue + 60, 444);
    let newEntry =
      Math.floor(Math.random() * (maxNewValue - minNewValue + 1)) + minNewValue;
    data.push(newEntry);
    lastValue = newEntry;
  }
  return data.concat(initialValues7Days);
};

// Définir la fonction handleSubmit en dehors de l'objet d'état
const handleSubmit = (set) => {
  set((state) => {
    const value = parseFloat(state.inputValue);
    if (isNaN(value)) {
      console.log("Entrée invalide:", state.inputValue);
      alert("Veuillez entrer un nombre valide.");
      return state;
    }

    const question = state.questions[state.currentQuestionIndex];
    if (question && question.stateKey) {
      const updatedState = { ...state, [question.stateKey]: value };
      console.log("Mise à jour de l'état avec :", updatedState);
      console.log(`Après mise à jour de ${question.text}:`, value);

      if (question.stateKey === "currentEarnings") {
        const newDataPoints = [...state.dataPoints7Days, value];
        if (newDataPoints.length > 7) newDataPoints.shift();

        const newDataPoints30Days = [...state.dataPoints30Days];
        newDataPoints30Days.push(state.dataPoints7Days[0]);
        if (newDataPoints30Days.length > 30) newDataPoints30Days.shift();

        return {
          ...updatedState,
          currentQuestionIndex: state.currentQuestionIndex + 1,
          inputValue: "",
          dataPoints7Days: newDataPoints,
          dataPoints30Days: newDataPoints30Days,
          dateLabels: generateDateLabels(),
          dateLabels30Days: generateDateLabels30Days(),
        };
      } else if (question.stateKey === "currentRpm") {
        const newDataPoints7DaysVue = [...state.dataPoints7DaysVue];
        if (
          newDataPoints7DaysVue.length === 7 &&
          newDataPoints7DaysVue[0] === 0
        ) {
          newDataPoints7DaysVue[0] = value;
        } else {
          newDataPoints7DaysVue.push(value);
          if (newDataPoints7DaysVue.length > 7) newDataPoints7DaysVue.shift();
        }

        const newDataPoints30DaysVue = [
          ...state.dataPoints30DaysVue.slice(1),
          value,
        ];

        return {
          ...updatedState,
          currentQuestionIndex: state.currentQuestionIndex + 1,
          inputValue: "",
          dataPoints7DaysVue: newDataPoints7DaysVue,
          dataPoints30DaysVue: newDataPoints30DaysVue,
        };
      }

      return {
        ...updatedState,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        inputValue: "",
      };
    }

    return state;
  });
};

const initialValues7Days = [357.5, 378.9, 410.2, 425.7, 435.3, 433, 434];
const initialValues30Days = generateInitialValues30Days();
const fixedValues7DaysVue = [0.45, 0.5, 0.55, 0.48, 0.42, 0.47, 0.53]; // Valeurs fixes pour le graphique Vue
const initialValues30DaysVue = generateInitialValues30DaysVue();

const useStore = create(
  devtools((set) => ({
    currentEarnings: 0,
    publicationViews: 0,
    publicationPercent: 0,
    followers: 0,
    followerPercent: 0,
    likes: 0,
    likesPercent: 0,
    lastPublicationViews: 0,
    lastPublicationLikes: 0,
    currentRpm: 0, // Nouvelle variable pour le RPM
    inputValue: "",
    modalVisible: false,
    currentQuestionIndex: 0,
    buttonVisible: true,
    questions: [
      { text: "Vues de publications ?", stateKey: "publicationViews" },
      { text: "% sur 7 jours (vues)", stateKey: "publicationPercent" },
      { text: "Followers nets ?", stateKey: "followers" },
      {
        text: "% en plus sur 7 jours (followers)",
        stateKey: "followerPercent",
      },
      { text: "J'aime ?", stateKey: "likes" },
      { text: "% en plus de j'aime sur 7 jours", stateKey: "likesPercent" },
      { text: "Vue dernière publication", stateKey: "lastPublicationViews" },
      { text: "Like dernière publication", stateKey: "lastPublicationLikes" },
      {
        text: "Combien as-tu gagné aujourd'hui ?",
        stateKey: "currentEarnings",
      },
      {
        text: "Combien de RPM aujourd'hui ?", // Nouvelle question pour le RPM
        stateKey: "currentRpm",
      },
    ],
    dataPoints7Days: initialValues7Days,
    dataPoints30Days: initialValues30Days,
    dataPoints7DaysVue: fixedValues7DaysVue, // Initialisation avec les valeurs fixes pour Vue
    dataPoints30DaysVue: initialValues30DaysVue,
    dateLabels: generateDateLabels(),
    dateLabels30Days: generateDateLabels30Days(),
    selection: {},
    setEarnings: (earnings) => set({ currentEarnings: earnings }),
    setPublicationViews: (views) => set({ publicationViews: views }),
    setPublicationPercent: (percent) => set({ publicationPercent: percent }),
    setFollowers: (followers) => set({ followers: followers }),
    setFollowerPercent: (percent) => set({ followerPercent: percent }),
    setLikes: (likes) => set({ likes: likes }),
    setLikesPercent: (percent) => set({ likesPercent: percent }),
    setLastPublicationViews: (views) => set({ lastPublicationViews: views }),
    setLastPublicationLikes: (likes) => set({ lastPublicationLikes: likes }),
    setCurrentRpm: (rpm) => set({ currentRpm: rpm }), // Setter pour le RPM
    setInputValue: (value) => set({ inputValue: value }),
    setModalVisible: (visible) => set({ modalVisible: visible }),
    setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
    setButtonVisible: (visible) => set({ buttonVisible: visible }),
    setDataPoints30Days: (dataPoints) => set({ dataPoints30Days: dataPoints }),
    setSelection: (key, value) =>
      set((state) => ({
        selection: { ...state.selection, [key]: value },
      })),
    handleSubmit: () => handleSubmit(set),
    addEarningsToDataPoints7Days: () =>
      set((state) => {
        const newDataPoints = [...state.dataPoints7Days, state.currentEarnings];
        if (newDataPoints.length > 7) newDataPoints.shift();

        const newDataPoints30Days = [...state.dataPoints30Days];
        newDataPoints30Days.push(state.dataPoints7Days[0]);
        if (newDataPoints30Days.length > 30) newDataPoints30Days.shift();

        return {
          dataPoints7Days: newDataPoints,
          dataPoints30Days: newDataPoints30Days,
          dateLabels: generateDateLabels(),
          dateLabels30Days: generateDateLabels30Days(),
        };
      }),
    addRpmToDataPoints7DaysVue: () =>
      set((state) => {
        const newDataPointsVue = [...state.dataPoints7DaysVue];
        newDataPointsVue.push(state.currentRpm);
        if (newDataPointsVue.length > 7) newDataPointsVue.shift();

        const newDataPoints30DaysVue = [
          ...state.dataPoints30DaysVue.slice(1),
          state.currentRpm,
        ];

        return {
          dataPoints7DaysVue: newDataPointsVue,
          dataPoints30DaysVue: newDataPoints30DaysVue,
        };
      }),
    getTotalSum7Days: () => {
      return initialValues7Days.reduce((acc, val) => acc + val, 0).toFixed(2);
    },
    getAverage7Days: () => {
      const sum = initialValues7DaysVue.reduce((acc, val) => acc + val, 0);
      return (sum / initialValues7DaysVue.length).toFixed(2);
    },
    getAverage30Days: () => {
      const sum = initialValues30DaysVue.reduce((acc, val) => acc + val, 0);
      return (sum / initialValues30DaysVue.length).toFixed(2);
    },
    validateInput: () =>
      set((state) => {
        const value = parseFloat(state.inputValue);
        if (isNaN(value)) {
          console.log("Entrée invalide:", state.inputValue);
          alert("Veuillez entrer un nombre valide.");
          return state;
        }

        const newDataPoints7Days = [...state.dataPoints7Days, value];
        if (newDataPoints7Days.length > 7) newDataPoints7Days.shift();

        const newDataPoints30Days = [...state.dataPoints30Days];
        newDataPoints30Days.push(newDataPoints7Days[0]);
        if (newDataPoints30Days.length > 30) newDataPoints30Days.shift();

        return {
          ...state,
          dataPoints7Days: newDataPoints7Days,
          dataPoints30Days: newDataPoints30Days,
          inputValue: "",
          dateLabels: generateDateLabels(),
          dateLabels30Days: generateDateLabels30Days(),
        };
      }),
  }))
);

export default useStore;
