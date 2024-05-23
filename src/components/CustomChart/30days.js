import React, { useState, useRef, useEffect } from "react";
import { View, Dimensions, PanResponder } from "react-native";
import {
  Svg,
  Line,
  Text as SvgText,
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Rect,
} from "react-native-svg";

const CustomChart30days = ({
  dataPoints = [],
  dateLabels = [],
  bottomDateLabels = [],
}) => {
  const chartFullWidth = Dimensions.get("window").width;
  const chartWidth = chartFullWidth - 100; // Réduire la largeur pour laisser plus d'espace à droite
  const chartHeight = 200;
  const extraHeight = 30;
  const yOffset = 10;
  const marginLeft = 40; // Augmenter la marge gauche pour décaler le graphique vers la droite

  const squareWidth = 60;
  const squareHeight = 60;
  const borderRadius = 5;

  const maxValue = Math.max(...dataPoints, 0.1); // Assurez-vous que maxValue ne soit jamais 0

  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const [nearestPoint, setNearestPoint] = useState(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        updateNearestPoint(gestureState.x0);
      },
      onPanResponderMove: (evt, gestureState) => {
        updateNearestPoint(gestureState.moveX);
      },
    })
  ).current;

  function updateNearestPoint(xLocation) {
    let nearestIndex = 0;
    let minDistance = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < dataPoints.length; i++) {
      const x = marginLeft + (chartWidth / (dataPoints.length - 1)) * i;
      const y =
        yOffset + chartHeight - (dataPoints[i] / maxValue) * chartHeight;
      const distance = Math.abs(x - xLocation);

      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
      if (y < minY) {
        minY = y; // Mettre à jour le minY pour savoir quel est le point le plus haut
      }
    }

    const x =
      marginLeft + (chartWidth / (dataPoints.length - 1)) * nearestIndex;
    const y =
      yOffset +
      chartHeight -
      (dataPoints[nearestIndex] / maxValue) * chartHeight;
    let adjustedX = x + 15;
    let adjustedY = y - squareHeight - 10;

    if (adjustedX + squareWidth > chartFullWidth) {
      adjustedX -= squareWidth + 30;
    }
    if (adjustedY < 0) {
      adjustedY = y + 20;
    }

    setNearestPoint({
      index: nearestIndex,
      value: dataPoints[nearestIndex],
      date: dateLabels[nearestIndex],
      x, // Coordonnée x du point
      y, // Coordonnée y du point
      isHighest: y === minY, // Définir si c'est le point le plus haut
    });
    setTouchPosition({ x: adjustedX, y: adjustedY });
  }

  const getPath = () => {
    if (dataPoints.length < 2) return "";

    // Commencer le chemin au premier point de la courbe
    let path = `M ${marginLeft + (chartWidth / (dataPoints.length - 1)) * 0} ${
      yOffset + chartHeight - (dataPoints[0] / maxValue) * chartHeight
    }`;

    // Dessiner les courbes pour le chemin du dégradé
    for (let i = 1; i < dataPoints.length; i++) {
      const x0 = marginLeft + (chartWidth / (dataPoints.length - 1)) * (i - 1);
      const y0 =
        yOffset + chartHeight - (dataPoints[i - 1] / maxValue) * chartHeight;
      const x1 = marginLeft + (chartWidth / (dataPoints.length - 1)) * i;
      const y1 =
        yOffset + chartHeight - (dataPoints[i] / maxValue) * chartHeight;

      const xc1 = (x0 + x1) / 2;
      const yc1 = y0;
      const xc2 = (x0 + x1) / 2;
      const yc2 = y1;

      path += ` C ${xc1} ${yc1}, ${xc2} ${yc2}, ${x1} ${y1}`;
    }

    // Fermer le chemin en revenant au point de départ en bas à gauche
    path += ` L ${marginLeft + chartWidth} ${yOffset + chartHeight}`;
    path += ` L ${marginLeft} ${yOffset + chartHeight}`;
    path += " Z";

    return path;
  };

  const getLinePath = () => {
    if (dataPoints.length < 2) return "";

    // Débuter au premier point
    let path = `M ${marginLeft + (chartWidth / (dataPoints.length - 1)) * 0} ${
      yOffset + chartHeight - (dataPoints[0] / maxValue) * chartHeight
    }`;

    // Dessiner les courbes en utilisant des points de contrôle
    for (let i = 1; i < dataPoints.length; i++) {
      const x0 = marginLeft + (chartWidth / (dataPoints.length - 1)) * (i - 1);
      const y0 =
        yOffset + chartHeight - (dataPoints[i - 1] / maxValue) * chartHeight;
      const x1 = marginLeft + (chartWidth / (dataPoints.length - 1)) * i;
      const y1 =
        yOffset + chartHeight - (dataPoints[i] / maxValue) * chartHeight;

      // Calcul des points de contrôle (simple moyenne pour cet exemple)
      const xc1 = (x0 + x1) / 2;
      const yc1 = y0;
      const xc2 = (x0 + x1) / 2;
      const yc2 = y1;

      // Utiliser la commande de courbe de Bézier cubique
      path += ` C ${xc1} ${yc1}, ${xc2} ${yc2}, ${x1} ${y1}`;
    }

    return path;
  };

  const chartRef = useRef();

  useEffect(() => {
    // Supposons que vous utilisiez une bibliothèque de graphiques qui nécessite une actualisation manuelle ou une manipulation spéciale
    if (chartRef.current) {
      chartRef.current.update(); // Ceci est un exemple hypothétique; ajustez selon la bibliothèque utilisée
    }
  }, [dataPoints]); // S'assurer que le graphique se met à jour lorsque dataPoints change
  return (
    <View {...panResponder.panHandlers} style={{ flex: 1 }}>
      <Svg
        height={chartHeight + extraHeight + yOffset + 50}
        width={chartFullWidth}
      >
        {/* Lignes horizontales et texte */}
        {Array.from({ length: 5 }, (_, i) => i).map((index) => (
          <React.Fragment key={index}>
            <Line
              x1={marginLeft}
              y1={yOffset + (index / 4) * chartHeight}
              x2={marginLeft + chartWidth}
              y2={yOffset + (index / 4) * chartHeight}
              stroke="#d3d3d3"
              strokeWidth="1"
            />
            <SvgText
              x={marginLeft + chartWidth + 5}
              y={yOffset + (index / 4) * chartHeight + 5}
              fontSize="12"
              fill="grey"
              textAnchor="start"
              alignmentBaseline="middle"
            >
              {((maxValue * (4 - index)) / 4).toFixed(2)}
            </SvgText>
          </React.Fragment>
        ))}
        {/* Ligne pointillée verticale */}
        {nearestPoint && (
          <Line
            x1={nearestPoint.x}
            y1={nearestPoint.isHighest ? yOffset + chartHeight : yOffset} // Si le point est le plus haut, commencer du bas
            x2={nearestPoint.x}
            y2={nearestPoint.isHighest ? nearestPoint.y : yOffset + chartHeight} // Si le point est le plus haut, finir au point
            stroke="#FF0000"
            strokeWidth="2"
            strokeDasharray="5, 5"
          />
        )}

        {bottomDateLabels.map((date, index) => (
          <SvgText
            key={`bottomDate-${index}`}
            x={
              marginLeft + (chartWidth / (bottomDateLabels.length - 1)) * index
            }
            y={chartHeight + extraHeight + yOffset + 0}
            fontSize="14"
            fill="grey"
            textAnchor="middle"
          >
            {date}
          </SvgText>
        ))}

        {/* Dégradé */}
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="100%">
            <Stop offset="0%" stopColor="#FF0000" stopOpacity="1" />
            <Stop offset="100%" stopColor="white" stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path d={getPath()} fill="url(#gradient)" />

        {/* Ligne passant par les points */}
        <Path d={getLinePath()} stroke="#FF0000" strokeWidth="2" fill="none" />

        {/* Affichage du point le plus proche */}
        {nearestPoint && (
          <React.Fragment>
            <Circle
              cx={
                marginLeft +
                (chartWidth / (dataPoints.length - 1)) * nearestPoint.index
              }
              cy={
                yOffset +
                chartHeight -
                (dataPoints[nearestPoint.index] / maxValue) * chartHeight
              }
              r={10} // Taille du cercle blanc
              fill="white"
            />
            <Circle
              cx={
                marginLeft +
                (chartWidth / (dataPoints.length - 1)) * nearestPoint.index
              }
              cy={
                yOffset +
                chartHeight -
                (dataPoints[nearestPoint.index] / maxValue) * chartHeight
              }
              r={5} // Taille du cercle rouge
              fill="#FF0000"
            />
            <Rect
              x={touchPosition.x}
              y={touchPosition.y}
              width={squareWidth}
              height={squareHeight}
              rx={borderRadius}
              ry={borderRadius}
              fill="white"
              stroke="#d3d3d3"
              strokeWidth="1"
            />
            <SvgText
              x={touchPosition.x + 10}
              y={touchPosition.y + 20}
              fill="black"
              fontSize="11"
              fontWeight="bold"
              textAnchor="start"
              alignmentBaseline="middle"
            >
              {`${nearestPoint.date}`}
            </SvgText>
            <SvgText
              x={touchPosition.x + 10}
              y={touchPosition.y + 40}
              fill="black"
              fontSize="12"
              fontWeight="bold"
              textAnchor="start"
              alignmentBaseline="middle"
            >
              {`€${nearestPoint.value}`}
            </SvgText>
          </React.Fragment>
        )}
      </Svg>
    </View>
  );
};
export default CustomChart30days;
