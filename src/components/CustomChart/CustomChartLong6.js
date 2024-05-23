import React, { useState, useRef } from "react";
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

const CustomChart6Values = ({ dataPoints = [] }) => {
  const chartWidth = Dimensions.get("window").width - 60;
  const chartHeight = 200;
  const extraHeight = 30;
  const yOffset = 10;

  const squareWidth = 60;
  const squareHeight = 60;
  const borderRadius = 5;

  const maxValue = Math.max(...dataPoints, 0);
  const minValue = 0;

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

    for (let i = 0; i < dataPoints.length; i++) {
      const x = (chartWidth / (dataPoints.length - 1)) * i;
      const distance = Math.abs(x - xLocation);

      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }

    const x = (chartWidth / (dataPoints.length - 1)) * nearestIndex;
    const y =
      yOffset +
      chartHeight -
      (dataPoints[nearestIndex] / maxValue) * chartHeight;

    let adjustedX = x + 20; // Augmente l'espace entre le cercle et le carré
    let adjustedY = y - 30; // Ajustement vertical pour mieux positionner le carré

    // Vérifier si le carré sort du graphique
    if (adjustedX + squareWidth > chartWidth) {
      // Si le carré sort à droite, le déplacer vers la gauche
      adjustedX = x - squareWidth - 20;
    }

    if (adjustedY < 0) {
      // Si le carré sort en haut, le déplacer vers le bas
      adjustedY = 0;
    } else if (adjustedY + squareHeight > chartHeight) {
      // Si le carré sort en bas, le déplacer vers le haut
      adjustedY = chartHeight - squareHeight;
    }

    setNearestPoint({ index: nearestIndex, value: dataPoints[nearestIndex] });
    setTouchPosition({ x: adjustedX, y: adjustedY });
  }

  const getPath = () => {
    if (dataPoints.length < 2) return "";

    let path = `M 20 ${
      yOffset + chartHeight - (dataPoints[0] / maxValue) * chartHeight
    }`;

    for (let i = 1; i < dataPoints.length; i++) {
      const x = (chartWidth / (dataPoints.length - 1)) * i + 20;
      const y =
        yOffset + chartHeight - (dataPoints[i] / maxValue) * chartHeight;
      path += ` L ${x} ${y}`;
    }

    // Closing the path for gradient fill
    path += ` L ${chartWidth + 20} ${yOffset + chartHeight}`;
    return path;
  };

  const getLinePath = () => {
    if (dataPoints.length < 2) return "";

    let path = `M 20 ${
      yOffset + chartHeight - (dataPoints[0] / maxValue) * chartHeight
    }`;

    for (let i = 1; i < dataPoints.length; i++) {
      const x = (chartWidth / (dataPoints.length - 1)) * i + 20;
      const y =
        yOffset + chartHeight - (dataPoints[i] / maxValue) * chartHeight;
      path += ` L ${x} ${y}`;
    }

    return path;
  };

  return (
    <View {...panResponder.panHandlers} style={{ flex: 1 }}>
      <Svg height={chartHeight + extraHeight + yOffset} width={chartWidth + 40}>
        {/* Lignes horizontales et texte */}
        {Array.from({ length: 4 }, (_, i) => i).map((index) => (
          <Line
            key={index}
            x1="20"
            y1={yOffset + (index / 3) * chartHeight}
            x2={chartWidth + 20}
            y2={yOffset + (index / 3) * chartHeight}
            stroke="#d3d3d3" // Changement de couleur pour la ligne à droite
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 4 }, (_, i) => i).map((index) => (
          <SvgText
            key={`text-${index}`}
            x={chartWidth + 25}
            y={yOffset + (index / 3) * chartHeight + 5}
            fontSize="14"
            fill="grey"
            textAnchor="start"
            alignmentBaseline="middle"
          >
            {Math.round((maxValue * (3 - index)) / 3)}
          </SvgText>
        ))}

        {/* Dates */}
        {["nov", "jan", "mars", "avr"].map((date, index) => (
          <SvgText
            key={`date-${index}`}
            x={index === 0 ? 30 : (chartWidth / 3) * index + 20}
            y={chartHeight + extraHeight + yOffset - 5}
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
                (chartWidth / (dataPoints.length - 1)) * nearestPoint.index + 20
              }
              cy={
                yOffset +
                chartHeight -
                (dataPoints[nearestPoint.index] / maxValue) * chartHeight
              }
              r={10}
              fill="white"
            />
            <Circle
              cx={
                (chartWidth / (dataPoints.length - 1)) * nearestPoint.index + 20
              }
              cy={
                yOffset +
                chartHeight -
                (dataPoints[nearestPoint.index] / maxValue) * chartHeight
              }
              r={5}
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
              y={touchPosition.y + 15}
              fill="black"
              fontSize="12"
              fontWeight="normal"
              textAnchor="start"
              alignmentBaseline="middle"
            >
              {`Index: ${nearestPoint.index}`}
            </SvgText>
            <SvgText
              x={touchPosition.x + 10}
              y={touchPosition.y + 35}
              fill="black"
              fontSize="12"
              fontWeight="bold"
              textAnchor="start"
              alignmentBaseline="middle"
            >
              {`Value: €${nearestPoint.value}`}
            </SvgText>
          </React.Fragment>
        )}
      </Svg>
    </View>
  );
};

export default CustomChart6Values;
