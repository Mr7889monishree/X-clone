import { View, Text, Alert, TouchableOpacity, TextInput, ScrollView, Image, Modal, Touchable } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CONVERSATIONS, ConversationType } from '@/data/conversations';
import { Feather } from '@expo/vector-icons';

const MessageScreen = () => {
  const insets = useSafeAreaInsets(); // Safe area padding
  const [searchText, setSearchText] = useState(""); 
  const [conversation, setConversation] = useState(CONVERSATIONS);
  const [selectConversation, setSelectConversation] = useState<ConversationType | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  // Delete conversation
  const deleteconversation = async (conversationId: number) => {
    Alert.alert("Delete Conversation", "Are you sure you want to delete the chat?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setConversation((prev) => prev.filter((conv) => conv.id !== conversationId));
        }
      }
    ]);
  };

  // Open a conversation
  const openconversation = (conversation: ConversationType) => {
    setSelectConversation(conversation);
    setIsChatOpen(true);
  };

  // Close conversation
  const closeconversation = () => {
    setIsChatOpen(false);
    setSelectConversation(null);
    setNewMessage("");
  };

  // Send message
  const sendMessage = () => {
    if (newMessage.trim() && selectConversation) {
      setSelectConversation({
        ...selectConversation,
        lastMessage: newMessage,
        time: "now",
      });

      setNewMessage("");
      Alert.alert(
        "Message Sent!",
        `Your message has been sent to ${selectConversation.user.name}`
      );
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white' edges={["top"]}>
      {/** HEADER */}
      <View className='flex-row justify-between items-center px-4 py-3 border-b border-gray-100'>
        <Text className='text-xl font-bold text-gray-900'>Messages</Text>
        <TouchableOpacity>
          <Feather name="edit" size={24} color="#1DA1F2" />
        </TouchableOpacity>
      </View>

      {/** SEARCH BAR */}
      {!isChatOpen && (
        <View className='px-4 py-3 border-b border-gray-100'>
          <View className='flex-row items-center bg-gray-100 rounded-full px-4 py-3'>
            <Feather name="search" size={20} color="#657786" />
            <TextInput
              placeholder='Search for people and groups'
              className='flex-1 ml-3 text-base'
              placeholderTextColor={"#657786"}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>
      )}

      {/** CHAT VIEW or CONVERSATION LIST */}
      {isChatOpen && selectConversation ? (
        <View className="flex-1 bg-white p-4">
          <TouchableOpacity onPress={closeconversation} className="mb-4">
            <Feather name="arrow-left" size={24} color="#1DA1F2" />
          </TouchableOpacity>

          <Text className="text-lg font-bold mb-2">
            Chat with {selectConversation.user.name}
          </Text>

          <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }} />
          
          <TextInput
            className="border border-gray-300 p-3 rounded-md mb-2"
            placeholder="Type your message..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity
            className="bg-blue-500 rounded-md py-3"
            onPress={sendMessage}
          >
            <Text className="text-white text-center font-semibold">Send</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className='flex-1'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        >
          {conversation.map(conversation => (
            <TouchableOpacity
              key={conversation.id}
              className='flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50'
              onPress={() => openconversation(conversation)}
              onLongPress={() => deleteconversation(conversation.id)}
            >
              <Image
                source={{ uri: conversation.user.avatar }}
                className="size-12 rounded-full mr-3"
              />
              <View className='flex-1'>
                <View className='flex-row items-center justify-between mb-1'>
                  <View className='flex-row items-center gap-2'>
                    <Text className='font-semibold text-gray-900'>
                      {conversation.user.name}
                    </Text>
                    {conversation.user.verified && (
                      <Feather name='check-circle' size={16} color="#1DA1F2" className='ml-1' />
                    )}
                    <Text className='text-gray-500 text-sm ml-1'>@{conversation.user.username}</Text>
                  </View>
                  <Text className='text-gray-500 text-sm'>{conversation.time}</Text>
                </View>
                <Text className='text-sm text-gray-500' numberOfLines={1}>
                  {conversation.lastMessage}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/** QUICK ACTIONS */}
      {!isChatOpen && (
        <View className='px-4 py-2 border-t border-gray-100 bg-gray-50'>
          <Text className='text-xs text-gray-500 text-center'>
            Tap to open + Long press to delete
          </Text>
        </View>
      )}

      {/**for the modal to pop out from the bottom of the screen 
       for this react native has a component called Modal
      */}
      <Modal
      visible={isChatOpen} //will be visible only when particular chat is open
      animationType="slide"
      presentationStyle="pageSheet"
      >
        <SafeAreaView className='flex-1'>
          <View className='flex-row items-center px-4 py-3 border-b border-gray-100'>
            <TouchableOpacity onPress={closeconversation} className='mr-3'>
              <Feather name="arrow-left" size={24} color="#1DA1F2"/>
            </TouchableOpacity>
            <Image
            source={{uri:selectConversation?.user.avatar}}
            className='size-10 rounded-full mr-3'
            />
            <View className='flex-1'>
              <View className='flex-row items-center'>
                <Text className='font-semibold text-gray-900 mr-1'>
                  {selectConversation?.user.name}
                </Text>
                {selectConversation?.user.verified && (
                <Feather name="check-circle" size={16} color="1DA1F2"/>
              )}
              </View>
              <Text className='text-gray-500 text-sm'>@{selectConversation?.user.username}</Text>
            </View>
          </View>
        <ScrollView className='flex-1 px-4 py-4'>
          <View className='mb-4'>
            <Text className='text-center text-gray-400 text-sm mb-4'>
              This is the beggining of your conversation with {selectConversation?.user.name}
            </Text>

            {/**conversation message */}
            {selectConversation?.messages.map((message)=>(
              <View key={message.id}
              className={`flex-row mb-3 ${message.fromUser ? "justify-end":""}`}>
                {!message.fromUser &&(
                  <Image
                  source={{uri:selectConversation.user.avatar}}
                  className="size-8 rounded-full mr-2"
                  />
                )}
                <View className={`flex-1 ${message.fromUser ? "items-end":""}`}>
                  <View
                  className={`rounded-2xl px-4 py-3 max-w-xs 
                    ${message.fromUser ? "bg-blue-500" : "bg-gray-100"}`}
                  >
                    <Text className={message.fromUser ? "text-white" :"text-gray-900"}>
                      {message.text}
                    </Text>
                  </View>
                  <Text className='text-xs text-gray-400 mt-1'>{message.time}</Text>

               </View>

              </View>
            ))}
          </View>
        </ScrollView>
        </SafeAreaView>

        {/**Message Input */}
        <View className='flex-row items-center px-4 py-3 border-t border-gray-100'>
          <View className='flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-3 mr-3'>
            <TextInput
            className='flex-1 text-baseme'
            placeholder='start a message...'
            placeholderTextColor="#657786"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            />
          </View>
          <TouchableOpacity 
          onPress={sendMessage}
          className={`size-10 rouned-full items-center justify-center ${
            newMessage.trim() ? "bg-blue-500" : "bg-gray-300"
          }`}
          disabled={!newMessage.trim()}
          >
            <Feather name="send" size={20} color="white"/>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MessageScreen;
