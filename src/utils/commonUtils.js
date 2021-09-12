import {Dimensions, StyleSheet} from 'react-native';
const {height} = Dimensions.get('window');

export function createStyles(
  baseStyle,
  mini = StyleSheet.create({}),
  tablet = StyleSheet.create({}),
) {
  if (height < 740) {
    return computeStyle(baseStyle, mini);
  } else if (height > 960) {
    return computeStyle(baseStyle, tablet);
  } else {
    return baseStyle;
  }
}
function computeStyle(base, other) {
  const finalStyle = Object.keys(other).reduce((total, current) => {
    const result = {
      ...total[current],
      ...other[current],
    };
    return {
      ...total,
      [current]: {
        ...total[current],
        ...result,
      },
    };
  }, base);
  return StyleSheet.create(finalStyle);
}
