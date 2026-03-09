import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Animated, { FadeInDown, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

interface SwipeableHistoryItemProps {
  address : string;
  index : number;
  onPress : () => void;
  onDelete : () => void;
}

const short = (s:string ,n=4) => `${s.slice(0,n)}...${s.slice(-n)}` 

export function SwipeableHistoryItem({
  address,
  index,
  onPress,
  onDelete,
  }: SwipeableHistoryItemProps) {

    const translateX = useSharedValue(0);

    const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      translateX.value = Math.min(0, event.translationX);
    })
    .onEnd((event) => {
      if (event.translationX < -100) {
        translateX.value = withSpring(-300);
        runOnJS(onDelete)();
      } else {
        translateX.value = withSpring(0);
      }
    });

    const cardStyle = useAnimatedStyle(() => ({
      transform: [{translateX: translateX.value},]
    }));

    const deleteStyle = useAnimatedStyle(() => ({
      opacity :Math.min(1, Math.abs(translateX.value)/100)
    }));

  return (
    <Animated.View
      entering ={FadeInDown.delay(150 + index* 50).springify()}
      style={s.container} >
      {/* delete backGround */}
      <Animated.View style={[s.deleteBackground, deleteStyle]}>
        <Ionicons name="trash" size={20} color="#fff" />
        <Text style={s.deleteText}>Delete</Text>
      </Animated.View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={cardStyle}>
          <TouchableOpacity style={s.item} onPress={onPress}>
            <Text style={s.address} numberOfLines ={1}>
              {short(address, 8)}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#6B7280" />
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  )
}

const s= StyleSheet.create({
  container: {
    marginBottom: 8,
    position: "relative",
  },
  deleteBackground: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16161D",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A35",
    gap: 12,
  },
  address: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "monospace",
  },
});