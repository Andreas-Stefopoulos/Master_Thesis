import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  NativeModules,
  ActivityIndicator,
} from 'react-native';
import styles from './style';
import DeviceInfo, { getUniqueId } from 'react-native-device-info';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import * as Progress from 'react-native-progress';
import {ProgressBar, Colors} from 'react-native-paper';
import RecordBtn from './Components/RecordBtn';
import LinearGradient from 'react-native-linear-gradient';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import moment from 'moment';
import Dialog from "react-native-dialog";
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import debounce from 'lodash.debounce';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker'
import RNPickerSelect from 'react-native-picker-select';

const App = () => {
  const height = Dimensions.get('window').height;
  const [recordingState, setRecordingState] = useState(null);
  const [rs, setRs] = useState(false);
  const [playerState, setPlayerState] = useState('stop');
  const [playerDuration, setPlayerDuration] = useState('00:00');
  const [show, setShow] = useState(false);
  const [url, setUrl] = useState('');
  const [grade,setGrade]=useState(0)
  const [loader, setLoader] = useState(false);
  const [promptText,setPromptText]=useState('')
  const [showPrompt,setShowPrompt]=useState(false)
    const grades = [{
    label:  'Optional',
    value:0
    },{
      label:  '1',
      value:1
      },{
        label:  '2',
        value:2
        },{
          label:  '3',
          value:3
          },{
            label:  '4',
            value:4
            },{
              label:  '5',
              value:5
              }];
  let audioRecorderPlayer = useRef(undefined);

  const onStartRecord = async () => {
    if (playerState == 'play') {
      alert('Please stop playing, before recording another audio');
      return;
    }
    setPlayerState('stop');
    setRs(true);
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          setShow(false);
          audioRecorderPlayer.current = await new AudioRecorderPlayer();
          const result = await audioRecorderPlayer.current.startRecorder();
          setUrl(result);

          audioRecorderPlayer.current.addRecordBackListener(e => {
            setRecordingState({
              recordSecs: e.currentPosition,
              recordTime: e.currentPosition / 1000,
            });
            if (
              audioRecorderPlayer.current.mmss(
                Math.floor(e.currentPosition / 1000),
              ) > '00:10'
            )
              onStopRecord();
            return;
          });
        } else {
          alert('Please Give the Required Permissions');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    } else {
      try {
        setShow(false);
          audioRecorderPlayer.current = await new AudioRecorderPlayer();
          const result = await audioRecorderPlayer.current.startRecorder();
          setUrl(result);

          audioRecorderPlayer.current.addRecordBackListener(e => {
            setRecordingState({
              recordSecs: e.currentPosition,
              recordTime: e.currentPosition / 1000,
            });
            if (
              audioRecorderPlayer.current.mmss(
                Math.floor(e.currentPosition / 1000),
              ) > '00:10'
            )
              onStopRecord();
            return;
          });
      } catch (err) {
        alert('Please Give the Required Permissions');
      }
    }
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.current.stopRecorder();
    audioRecorderPlayer.current.removeRecordBackListener();
    setShow(true);
    setRs(false);
  };

  const onStartPlay = async () => {
    console.log(recordingState);
    if (playerState == 'stop') {
      const msg = audioRecorderPlayer.current.startPlayer();
      setPlayerState('play');

      audioRecorderPlayer.current.addPlayBackListener(e => {
        if (
          audioRecorderPlayer.current.mmss(e.currentPosition / 1000) >= 10 ||
          e.currentPosition / 1000 >= recordingState?.recordTime - 0.5
        ) {
          debounceStopPlay();

          return;
        } else {
          setPlayerDuration(e.currentPosition / 1000);
        }
      });
    } else {
      setPlayerState('play');
      audioRecorderPlayer.current.resumePlayer();
    }
  };
  const onPausePlay = async () => {
    setPlayerState('pause');
    await audioRecorderPlayer.current.pausePlayer();
  };
  const onStopPlay = async () => {
    setPlayerState('stop');
    audioRecorderPlayer.current.stopPlayer();
    audioRecorderPlayer.current.removePlayBackListener();
  };
  const debounceStartPlay = () => onStartPlay();
  const debounceStopPlay = useCallback(debounce(onStopPlay, 300), []);
  const debouncePausePlay = useCallback(debounce(onPausePlay, 300), []);

  const [pos, setPos] = useState({});

  useEffect(() => {
    AsyncStorage.setItem('baseURL', 'WebServerLocation');
    requestPermissions();
  }, []);

  async function requestPermissions() {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') {
        // do something if granted...
      }
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (PermissionsAndroid.RESULTS.GRANTED) {
        console.log('permission granted');
      }
    }
  }

  const takeServerDetails = () => {
  setPromptText('')
  setShowPrompt(true)
  };
  const sendDetail = () => {
    AsyncStorage.getItem('baseURL')
      .then(res => {
        if (res == null) {
          alert('Please add baseURL before sending data to server');
        } else {
          console.log(res);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  function timeout(ms, promise) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject(new Error('timeout'));
      }, ms);
      promise.then(resolve, reject);
    });
  }
  const upload = () => {
    if (loader) return;

    setLoader(true);
    if (!url) {
      alert('No sound recorded. Please record a sound and then press Send');
      setLoader(false);
      return;
    }
    Geolocation.getCurrentPosition(
      position => {
        const data = new FormData();

        data.append('name', getUniqueId());
        data.append('sound_filename','sound_'+moment(new Date()).format('YYYY-MM-DD HH:MM:SS'))
        data.append('latitude',position?.coords?.latitude)
        data.append('longitude',position?.coords?.longitude)
        data.append('time',moment(new Date()).format('YYYY-MM-DD HH:MM:SS'))
        data.append('grade',grade)
        data.append('file',{
          uri:url,
          type:'audio/wav',
          name:'sound.wav'
        });
        AsyncStorage.getItem('baseURL').then(res => {
          timeout(
            900000,
            fetch(`${res}/sound/`, {
              body: data,

              method: 'POST',
            })
              .then(res => {
                setLoader(false);
                //setUrl('')
                alert('Sound Sent Successfully.');
              })
              .catch(err => {
                console.log(err)
                setLoader(false);
                alert(
                  'Please re-enter the server address or contact with the server administrator',
                );
                console.log(err);
              }),
          ).catch(err => {
            console.log(err)
            setLoader(false);
            alert(
              'Please re-enter the server address or contact with the server administrator',
            );
          });
        });
      },
      error => {
        setLoader(false);
        // See error code charts below.
        console.log('err -> ' + error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <LinearGradient colors={['white', '#D3D3D3']} style={{flex: 1}}>
        <ScrollView style={styles.scroll}>
          <View style={styles.container}>
            <View style={[styles.viewH, {height: height * 0.15}]}>
              <Image
                source={require('./Images/logo.jpeg')}
                style={styles.image}
              />
              <Text style={styles.headText}>Urban Sound Quality Recognition System</Text>
            </View>

            <View
              style={[
                styles.card,
              // {height: height * 0.4, justifyContent: 'center',marginTop:20},
              ]}>
              <ProgressBar
                progress={recordingState ? recordingState?.recordTime / 10 : 0}
                style={styles.progress}
                color="#49B5F2"
                animationType="timing"
              />

              <View style={[styles.secContainer]}>
                <Text style={{color: 'black'}}>0 sec</Text>
                <Text style={{color: 'black'}}>10 sec's</Text>
              </View>
              <View style={[styles.secContainer, {marginLeft: -20,position:'absolute',top:70}]}>
                <TouchableOpacity
                  style={[styles.btn]}
                  onPress={() => {
                    Alert.alert(
                      'Instructions',
                      `\n
1) Press blue button one time to start recording.\n
2) Record a 10 second sound of your urban territory.\n
3) Add a grade of 1-5 with 1 being unbearable sound quality and 5 being very good sound quality (optional).\n
4) Press play if you wish to hear your record. Record again in case of false record.\n
5) Press send (in case of server change, kindly change the server first and then send).`,
                    );
                  }}>
                  <Text style={{color: 'black'}}>Help</Text>
                </TouchableOpacity>
              </View>
              {!rs ? (
                <TouchableOpacity
                  style={styles.circleBtn}
                  onPress={() => onStartRecord()}>
                  <Icon name="microphone" size={40} color="white" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.circleBtn, {backgroundColor: 'red'}]}
                  onPress={() => onStopRecord()}>
                  <Icon name="pause" size={40} color="white" />
                </TouchableOpacity>
              )}
              {/* <Text style={{color:'black'}}>{playerDuration}</Text> */}
              <Text
                style={[
                  styles.btn,
                  {color: 'black', backgroundColor: 'white'},
                ]}>
                {!rs ? 'Record' : 'Stop'}
              </Text>
              {/* <RecordBtn
                value="Record"
                bgColor={'#bcf5bc'}
                bdColor={'green'}
                textColor={'black'}
              /> */}
            </View>
            <View
              style={[
                styles.card,
                {
                  // height: height * 0.3,
                  justifyContent: 'center',
                  paddingVertical: 10,
                },
              ]}>
              {show &&
                (playerState == 'pause' || playerState == 'stop' ? (
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={debounceStartPlay}>
                    <Icon name="play" size={16} color={'black'} />
                    <Text style={{paddingStart: 2, color: 'black'}}>Play</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={debouncePausePlay}>
                    <Icon name="pause" size={16} color={'black'} />
                    <Text style={{paddingStart: 2, color: 'black'}}>Pause</Text>
                  </TouchableOpacity>
                ))}
              {loader ? (
                <ActivityIndicator size={30} color="black" />
              ) : (
                <TouchableOpacity style={styles.btn} onPress={() => upload()}>
                  <Icon name="share" size={16} color={'black'} />
                  <Text style={{paddingStart: 2, color: 'black'}}>Send</Text>
                </TouchableOpacity>
              )}
              {show && <View style={[styles.btn,{backgroundColor:'white'}]}>
              <Text style={{color:'black', fontSize:17}}>Perceived{"\n"}Soundscape{"\n"}Quality</Text>
              <View   style={{flex:0.9, backgroundColor: '#DCDCDC',marginLeft:5,borderRadius:15}}>
              <RNPickerSelect
                // selectedValue={selectedValue}

               items={[...grades]}
               textInputProps={{placeholderTextColor:'black'}}
                style={{inputIOS: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: 'transparent',
        color: 'black',
    },
    inputAndroid: {
        color: 'black'
    },
    placeholderColor: 'black',
    underline: {
        borderTopWidth: 0
    },
    icon: {
        position: 'absolute',
        backgroundColor: 'transparent',
        borderTopWidth: 5,
        borderTopColor: 'white',
        borderRightWidth: 5,
        borderRightColor: 'transparent',
        borderLeftWidth: 5,
        borderLeftColor: 'transparent',
        width: 0,
        color:'black',
        height: 0,
        top: 20,
        right: 15,
    },}}
             pickerProps={{dropdownIconColor:'black',dropdownIconRippleColor:'black'}}
                placeholder={{}}
                onValueChange={(g)=>setGrade(g)}
                // onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
              >
               
              </RNPickerSelect></View></View>
              }
              <TouchableOpacity style={styles.btn} onPress={takeServerDetails}>
                <Icon name="grid" size={16} color={'black'} />
                <Text style={{paddingStart: 2, color: 'black'}}>
                  Change Server
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    <Text style={{backgroundColor:'#DCDCDC',padding:5,paddingLeft:10}}>Developed by Andreas Stefopoulos</Text>
    <View>
    <Dialog.Container visible={showPrompt}>
      <Dialog.Title>Enter Server Details</Dialog.Title>
      <Dialog.Description>
       {` Write your server details in the following format: http://{server_address}:{port}.`}
      </Dialog.Description>
      <Dialog.Button label="Cancel" style='cancel' onPress={()=>setShowPrompt(false)}/>
      <Dialog.Button label="OK"  onPress={()=>{
        AsyncStorage.setItem('baseURL',promptText)
        setShowPrompt(false)
        }} />
      <Dialog.Input placeholder='Server Detail' defaultValue='' value={promptText} onChangeText={(_)=>setPromptText(_)} ></Dialog.Input>
    </Dialog.Container>
  </View>
    </SafeAreaView>
  );
};
export default App;
