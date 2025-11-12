import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
export interface Comment{
    id: number;
    username: string;
    profileImage:string;
    text: string;
    date: string;

}
interface CommentProps {
    comment: Comment;
}
const Comment: React.FC<CommentProps> = ({ comment }) => {
    return (
        <View style={styles.commentContainer}>
            <Image source={{ uri: comment.profileImage }} style={styles.profileImage} />        
            <View style={styles.textContainer}>
                <View style={styles.header}>
                    <Text style={styles.username}>{comment.username}</Text> 
                    <Text style={styles.date}>{comment.date}</Text>
                </View>
                <Text style={styles.comment}>{comment.text}</Text>
                <TouchableOpacity>
                    <Text style={styles.reply}>Reply</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({ 
    commentContainer: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    profileImage: {
        width: 40,      
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',   
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    username: {
        fontWeight: 'bold', 
        fontSize: 16,
    },
    date: {
        fontSize: 12,
        color: '#888',
    },
    comment: {
        fontSize: 14,
        marginBottom: 5,
    },
    reply: {
        fontSize: 14,       
        color: '#007BFF',
        fontWeight: '500',
    },
});
  
export default Comment;

            