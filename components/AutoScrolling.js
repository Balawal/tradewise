import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Dimensions, View } from 'react-native';

const { width } = Dimensions.get('window');

const AutoScrolling = ({ data, renderItem, itemWidth, speed = 20 }) => {
  const flatListRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const scrollInterval = useRef(null);

  const startAutoScroll = () => {
    scrollInterval.current = setInterval(() => {
      setScrollX(prevScrollX => {
        const newScrollX = prevScrollX + 1;
        if (newScrollX >= data.length * itemWidth) {
          flatListRef.current.scrollToOffset({ offset: 0, animated: false });
          return 0;
        } else {
          flatListRef.current.scrollToOffset({ offset: newScrollX, animated: true });
          return newScrollX;
        }
      });
    }, speed);
  };

  const stopAutoScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      renderItem={renderItem}
      horizontal
      keyExtractor={(item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false} // Disable manual scrolling
    />
  );
};

export default AutoScrolling;

// import React, { useEffect, useRef, useState } from 'react';
// import { View, Image, Dimensions, FlatList } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';

// const { width } = Dimensions.get('window');

// const originalData = [
//   {
//     url: 'https://cdn.pixabay.com/photo/2015/02/24/15/41/dog-647528_1280.jpg',
//   },
//   {
//     url: 'https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2017/04/12185602/Lagotto-Romangolo-Tongue-Out.jpg',
//   },
//   {
//     url: 'https://boygeniusreport.files.wordpress.com/2016/11/puppy-dog.jpg?quality=98&strip=all',
//   },
//   {
//     url: 'https://images2.minutemediacdn.com/image/upload/c_crop,h_1689,w_3000,x_0,y_404/f_auto,q_auto,w_1100/v1563809078/shape/mentalfloss/28865-gettyimages-500694766.jpg',
//   },
//   {
//     url: 'https://d17fnq9dkz9hgj.cloudfront.net/breed-uploads/2018/08/basset-hound-detail.jpg?bust=1535565151&width=355',
//   },
// ];

// // Duplicate the data array 5 times
// const data = [...Array(5)].flatMap(() => originalData);

// export default function SearchScreen() {
//   const flatListRef = useRef(null);
//   const [scrollX, setScrollX] = useState(0);
//   const scrollInterval = useRef(null);

//   const startAutoScroll = () => {
//     scrollInterval.current = setInterval(() => {
//       setScrollX(prevScrollX => {
//         const newScrollX = prevScrollX + 1;
//         if (newScrollX >= data.length * (width / originalData.length)) {
//           // Reset to the start after scrolling through the items 5 times
//           flatListRef.current.scrollToOffset({ offset: 0, animated: false });
//           return 0;
//         } else {
//           flatListRef.current.scrollToOffset({ offset: newScrollX, animated: true });
//           return newScrollX;
//         }
//       });
//     }, 20); // Adjust this interval to change the scroll speed
//   };

//   const stopAutoScroll = () => {
//     if (scrollInterval.current) {
//       clearInterval(scrollInterval.current);
//     }
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       startAutoScroll();

//       return () => stopAutoScroll();
//     }, [])
//   );

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <FlatList
//         ref={flatListRef}
//         data={data}
//         renderItem={({ item }) => (
//           <View
//             style={{
//               width: 200,
//               height: 170,
//               borderRadius: 10,
//               elevation: 5,
//               marginHorizontal: 5,
//               backgroundColor:'#111111'
//             }}
//           >
//             <Image
//               style={{ width: '100%', height: '100%', borderRadius: 10 }}
//               source={{ uri: item.url }}
//             />
//           </View>
//         )}
//         horizontal
//         keyExtractor={(item, index) => item.url + index}
//         showsHorizontalScrollIndicator={false}
//         scrollEnabled={false} // Disable manual scrolling
//       />
//     </View>
//   );
// }