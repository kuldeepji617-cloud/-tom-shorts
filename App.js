import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StatusBar, StyleSheet, TextInput, Modal
} from 'react-native';

const videos = [
  { id: '1', user: '@tom_creator', caption: 'Welcome to Tom Shorts! 🔥', tags: '#TomShorts #Welcome', color: '#512DA8', emoji: '🎬' },
  { id: '2', user: '@funny_world', caption: 'Hansi ka dose 😂', tags: '#Funny #Comedy', color: '#C62828', emoji: '😂' },
  { id: '3', user: '@daily_vibes', caption: 'Apni life enjoy karo ✨', tags: '#Vibes #Life', color: '#00695C', emoji: '✨' },
];

export default function App() {
  const [tab, setTab] = useState('Home');
  const [liked, setLiked] = useState({});
  const [comments, setComments] = useState({});
  const [active, setActive] = useState(null);
  const [message, setMessage] = useState('');
  const [allComments, setAllComments] = useState({});
  const [caption, setCaption] = useState('');

  const addComment = () => {
    if (!message.trim() || active === null) return;
    setAllComments(old => ({
      ...old,
      [active]: [...(old[active] || []), message.trim()]
    }));
    setMessage('');
  };

  const renderVideo = ({ item }) => (
    <View style={[s.video, { backgroundColor: item.color }]}>
      <Text style={s.logo}>TOM SHORTS</Text>
      <Text style={s.emoji}>{item.emoji}</Text>
      <Text style={s.preview}>VIDEO PREVIEW</Text>

      <View style={s.info}>
        <Text style={s.user}>{item.user}</Text>
        <Text style={s.caption}>{item.caption}</Text>
        <Text style={s.tags}>{item.tags}</Text>
      </View>

      <View style={s.actions}>
        <TouchableOpacity onPress={() =>
          setLiked(old => ({ ...old, [item.id]: !old[item.id] }))
        }>
          <Text style={s.action}>{liked[item.id] ? '❤️' : '🤍'}{"\n"}{liked[item.id] ? 1 : 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActive(item.id)}>
          <Text style={s.action}>💬{"\n"}{allComments[item.id]?.length || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTab('Profile')}>
          <Text style={s.action}>👤{"\n"}Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const showHome = () => (
    <>
      <View style={s.top}>
        <Text style={s.brand}>Tom Shorts</Text>
        <Text style={s.topLabel}>Following　 For You</Text>
      </View>
      <FlatList
        data={videos}
        renderItem={renderVideo}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      />
    </>
  );

  const page = () => {
    if (tab === 'Home') return showHome();

    if (tab === 'Discover') return (
      <View style={s.page}>
        <Text style={s.heading}>🔎 Discover</Text>
        <Text style={s.white}>Trending #Comedy #Music #Vlogs</Text>
        {videos.map(v => (
          <Text key={v.id} style={s.listItem}>{v.emoji}  {v.caption}  {v.tags}</Text>
        ))}
      </View>
    );

    if (tab === 'Create') return (
      <View style={s.page}>
        <Text style={s.heading}>＋ Create Video</Text>
        <Text style={s.white}>Apni video upload karne ka feature agle step mein jodenge.</Text>
        <Text style={s.listItem}>📱 Gallery upload — setup required</Text>
        <TextInput
          style={s.input}
          placeholder="Video caption likhein..."
          placeholderTextColor="#aaa"
          value={caption}
          onChangeText={setCaption}
        />
        <Text style={s.white}>Caption: {caption || 'Abhi khaali hai'}</Text>
      </View>
    );

    if (tab === 'Inbox') return (
      <View style={s.page}>
        <Text style={s.heading}>📩 Inbox</Text>
        <Text style={s.white}>Aapke messages yahan dikhenge.</Text>
      </View>
    );

    return (
      <View style={s.page}>
        <Text style={s.avatar}>👤</Text>
        <Text style={s.heading}>Tom Shorts User</Text>
        <Text style={s.white}>0 Followers　 ·　0 Following</Text>
        <Text style={s.listItem}>Aapki videos yahan dikhenge.</Text>
      </View>
    );
  };

  return (
    <View style={s.app}>
      <StatusBar barStyle="light-content" backgroundColor="#090909" />
      {page()}

      <View style={s.nav}>
        {[
          ['Home', '⌂'],
          ['Discover', '⌕'],
          ['Create', '＋'],
          ['Inbox', '✉'],
          ['Profile', '♙'],
        ].map(([name, icon]) => (
          <TouchableOpacity
            key={name}
            style={s.navItem}
            onPress={() => setTab(name)}
          >
            <Text style={[s.navIcon, tab === name && { color: '#FF3158' }]}>
              {icon}
            </Text>
            <Text style={[s.navText, tab === name && { color: '#FF3158' }]}>
              {name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={active !== null} transparent animationType="slide"
        onRequestClose={() => setActive(null)}>
        <View style={s.modalBg}>
          <View style={s.modal}>
            <Text style={s.heading}>Comments</Text>
            <FlatList
              data={allComments[active] || []}
              keyExtractor={(_, i) => String(i)}
              ListEmptyComponent={<Text style={s.white}>Abhi koi comment nahi.</Text>}
              renderItem={({ item }) => <Text style={s.listItem}>{item}</Text>}
            />
            <TextInput
              style={s.input}
              placeholder="Comment likhein..."
              placeholderTextColor="#aaa"
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity style={s.send} onPress={addComment}>
              <Text style={s.white}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActive(null)}>
              <Text style={s.close}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  app: { flex: 1, backgroundColor: '#090909' },
  top: { padding: 12, backgroundColor: '#090909' },
  brand: { color: '#FF3158', fontSize: 23, fontWeight: 'bold' },
  topLabel: { color: 'white', marginTop: 8, fontSize: 15 },
  video: { height: 610, justifyContent: 'center', padding: 18 },
  logo: { color: 'white', fontWeight: 'bold', fontSize: 20 },
  emoji: { textAlign: 'center', fontSize: 90 },
  preview: { color: 'white', textAlign: 'center', marginTop: 10 },
  info: { position: 'absolute', left: 16, bottom: 24, width: '72%' },
  user: { color: 'white', fontWeight: 'bold', fontSize: 17 },
  caption: { color: 'white', marginTop: 7, fontSize: 15 },
  tags: { color: '#fff', marginTop: 5 },
  actions: { position: 'absolute', right: 14, bottom: 32, gap: 25 },
  action: { color: 'white', fontSize: 17, textAlign: 'center' },
  nav: { height: 65, flexDirection: 'row', backgroundColor: '#111', justifyContent: 'space-around' },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navIcon: { color: 'white', fontSize: 23 },
  navText: { color: 'white', fontSize: 10 },
  page: { flex: 1, padding: 22, paddingTop: 50 },
  heading: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  white: { color: 'white', fontSize: 15 },
  listItem: { color: 'white', backgroundColor: '#222', padding: 15, marginTop: 12, borderRadius: 10 },
  input: { color: 'white', borderColor: '#666', borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 15 },
  avatar: { fontSize: 70, textAlign: 'center' },
  modalBg: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#0009' },
  modal: { height: '65%', backgroundColor: '#171717', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  send: { backgroundColor: '#C62848', padding: 12, alignItems: 'center', borderRadius: 8, marginTop: 8 },
  close: { color: 'white', textAlign: 'center', padding: 15 },
});