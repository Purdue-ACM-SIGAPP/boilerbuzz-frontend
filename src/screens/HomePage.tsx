import React, {useState} from "react";
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity} from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import theme from "../theme";
import HeaderBanner from "../components/HeaderBanner";
import PosterCard from "../components/PosterCard";
import CommentScroll from "../components/CommentScroll";
import Comment from "../components/Comment";    
type Props = BottomTabScreenProps<BottomTabsParamList, "Home">;

export default function FeaturedPage({ navigation, route }: Props) {

  // ============================== DUMMY DATA ==============================
  const events = [
    {
      id: "1",
      eventTitle: "Mid-Autumn Festival Celebration",
      eventDate: "Oct 12, 2025",
      eventLocation: "Union Ballroom",
      description: "Join us for mooncakes, lanterns, and live performances!",
      clubName: "Asian Student Union",
      clubLogo: "https://i.pravatar.cc/150?img=1",
      attendees: [
        { id: "1", name: "Soleil", avatar: "https://i.pravatar.cc/150?img=2" },
        { id: "2", name: "Alex", avatar: "https://i.pravatar.cc/150?img=3" },
        { id: "3", name: "Linh", avatar: "https://i.pravatar.cc/150?img=4" },
      ],
      comments: [
        { id: "1", user: "Jamie", text: "Can’t wait!" , date: "2 days ago"},
        { id: "2", user: "Linh", text: "This looks amazing 💛" , date: "3 days ago"},
      ],
    },
    {
      id: "2",
      eventTitle: "Club Fair 2025",
      eventDate: "Sep 30, 2025",
      eventLocation: "Campus Quad",
      description: "Explore 100+ clubs, get free swag, and meet new friends.",
      clubName: "Student Council",
      clubLogo: "https://i.pravatar.cc/150?img=5",
      attendees: [
        { id: "1", name: "Soleil", avatar: "https://i.pravatar.cc/150?img=6" },
        { id: "2", name: "Mia", avatar: "https://i.pravatar.cc/150?img=7" },
      ],
      comments: [{ id: "1", user: "Eli", text: "I’ll definitely stop by!" ,date: "1 day ago"}],
    },
    {
      id: "3",
      eventTitle: "Coding Hackathon 2025",
      eventDate: "Nov 1, 2025",
      eventLocation: "Innovation Hub",
      description: "24 hours. One project. Free pizza. Let’s build something awesome.",
      clubName: "Tech Club",
      clubLogo: "https://i.pravatar.cc/150?img=8",
      attendees: [
        { id: "1", name: "Soleil", avatar: "https://i.pravatar.cc/150?img=9" },
        { id: "2", name: "Aria", avatar: "https://i.pravatar.cc/150?img=10" },
        { id: "3", name: "Kai", avatar: "https://i.pravatar.cc/150?img=11" },
        { id: "4", name: "Devon", avatar: "https://i.pravatar.cc/150?img=12" },
      ],
      comments: [
        { id: "1", user: "Riley", text: "Team up with me?", date: "5 hours ago" },
        { id: "2", user: "Taylor", text: "Hackathon = caffeine + chaos ☕" , date: "3 hours ago" },
      ],
    },
  ];

  const [showComments, setShowComments] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const selectedComments =
    selectedEventId != null
      ? events.find((e) => e.id === selectedEventId)?.comments ?? commentsData
      : commentsData;

  return (
    <View style={styles.container}>
      <HeaderBanner title="Home" />
       <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PosterCard
            {...item}
            onPressComment={(id) => {
              setSelectedEventId(id ?? null);
              setShowComments(true);
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      <CommentScroll
        visible={showComments}
        eventId={selectedEventId}
        initialComments={selectedComments}
        onClose={() => setShowComments(false)}
      />
    </View>
  );
}

// ============================== local state ==============================

// moved below component to keep top of file clean

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
});

const commentsData = [
    {
        id: '1',
        user: 'Soleil', 
        //profileImage: 'https://i.pravatar.cc/150?img=13',
        text: 'This event was amazing! Had a great time meeting new people.',
        date: '2 hours ago',
        //date: '2 hours ago',  
    },
    {
        id: '2',
        user: 'Alex',
        //profileImage: 'https://i.pravatar.cc/150?img=14',
        text: 'Looking forward to the next one!',
        date: '30 minutes ago',
        //date: '1 hour ago',
    },
];
const HomePage: React.FC = () => {
 

  return (
   <View style={stylesComments.container}>
      <Text style={stylesComments.title}>Home Page</Text>

      {/* Render all comments from the array */}
      {commentsData.map((comment) => (
        <View key={comment.id} style={stylesComments.commentContainer}>
          {/* <Image source={{ uri: comment.profileImage }} style={stylesComments.avatar} /> */}
          <View style={stylesComments.commentContent}>
            <View style={stylesComments.header}>
              <Text style={stylesComments.username}>{comment.user}</Text>
              {/* <Text style={stylesComments.date}>{comment.date}</Text> */}
            </View>

            <Text style={stylesComments.commentText}>{comment.text}</Text>

            <TouchableOpacity>
              <Text style={stylesComments.reply}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>

   
  );
};

const stylesComments = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  commentContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  commentText: {
    marginVertical: 4,
    fontSize: 14,
    color: '#333',
  },
  reply: {
    fontSize: 13,
    color: '#007bff',
    marginTop: 2,
  },
});



