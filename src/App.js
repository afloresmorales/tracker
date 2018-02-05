import React, {Component} from 'react';
import {
    Text,StyleSheet,View,Button,
    ActivityIndicator,AsyncStorage,Alert,
    TouchableWithoutFeedback,FlatList,ListView, TouchableHighlight,
    Modal,
    ScrollView,
    Picker
} from 'react-native';
import CountdownCircle from 'react-native-countdown-circle';
import {Stopwatch,Timer} from 'react-native-stopwatch-timer';
import {StackNavigator, TabNavigator,router} from 'react-navigation';
import CardSection from './components/CardSection';
import Input from './components/Input';
import Card from './components/Card';
import Header from './components/Header';
import MultilineInput from './components/MultilineInput';
import firebase from 'firebase';
//import WorkoutForm from './components/WorkoutForm';

const firebaseConfig = {
    apiKey: "AIzaSyD8J9KhD6Z5htyxyWlr8MpOLF0rPBLrd70",
    authDomain: "workoutracker-8d106.firebaseapp.com",
    databaseURL: "https://workoutracker-8d106.firebaseio.com",
    projectId: "workoutracker-8d106",
    storageBucket: "workoutracker-8d106.appspot.com"
}
const firebaseApp= firebase.initializeApp(firebaseConfig);

const key = '@MyApp:key';

class WorkoutForm extends Component {
    constructor (props) {
        super(props);
        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            workoutDataSource: ds,
            modalVisible: false,
            workout:'',
            sets:''
        }
        this.workoutsRef = this.getRef().child('workouts');
        this.renderRow= this.renderRow.bind(this);
        this.pressRow= this.pressRow.bind(this);
        }
    getRef(){
        return firebaseApp.database().ref();
    }
    setModalVisible(visible){
        this.setState({modalVisible : visible});
    }

    getWorkouts(workoutsRef){
       // let workouts = [{title:'Workout One'},{title:'Workout Two'}];

        workoutsRef.on('value',(snap)=>{
            let workouts = [];

            snap.forEach((child)=>{
                workouts.push({
                    title: child.val().title,
                    subtitle:child.val().subtitle,
                    _key: child.key
                });
            });
            
            this.setState({
                workoutDataSource: this.state.workoutDataSource.cloneWithRows(workouts)
            });
        });
    }
    componentWillMount(){
        this.getWorkouts(this.workoutsRef);
    }
    componentDidMount(){
       // this.getWorkouts(this.workoutsRef);
    }
    pressRow(workout){
      this.workoutsRef.child(workout._key).remove();
    }
    renderRow(workout){
        const {container,textStyle}=styles;
        return(
            <TouchableHighlight onPress={()=>{this.pressRow(workout);}}>
                <View style={container}>
                    <CardSection>
                        <Text style={textStyle}>{workout.title}</Text>
                    </CardSection>
                </View>
            </TouchableHighlight>
        );
    }
    addWorkout(){
        this.setModalVisible(true);
    }

    render(){
        const {labelStyle, textStyle} = styles;
        let workout = this.state.workout;
        let sets = this.state.sets;

        return (
            <View>
                <Modal
              visible={this.state.modalVisible}
              transparent={false}
              animationType={'slide'}
              onRequestClose={() => {}}
          >
            <View >
                <Card>
              <View >
                    <CardSection>
                        <Text style={labelStyle}>Workout</Text>
                    </CardSection>
                    <CardSection>
                        <Input
                            label="Workout"
                            value={this.state.workout}
                            placeholder="Add Workout"
                            onChangeText={(workout)=>this.setState({workout:workout})}
                        />
                    </CardSection>
                    <CardSection>
                        <Text style={labelStyle}>Sets and Reps</Text>
                    </CardSection>
                    <CardSection>
                        <MultilineInput
                        style={textStyle}
                        multiline={true}
                        numberOflines= {40}              
                        onChangeText = {(sets)=>this.setState({sets:sets})}
                        value = {this.state.sets}
                        />
                     </CardSection> 
              </View>
              </Card> 
            </View>
            <Button
                    onPress={() => {
                        this.workoutsRef.push({title:this.state.workout,subtitle:this.state.sets});
                        this.setModalVisible(!this.state.modalVisible)}}
                        title="Save Workout"
                />
          </Modal>
                <ListView
                    enableEmptySections
                    dataSource={this.state.workoutDataSource}
                    renderRow={this.renderRow}
                />
                <Button onPress = {this.addWorkout.bind(this)}
                        title = "Add Workout"
                        />
            </View>
        );
    }
}

class WorkoutCreate extends Component {
    constructor (props) {
        super(props);
        this.state = {
            workout:'',
            sets:'',
            date:''
        }
        this.workoutsRef = this.getRef().child('workouts');
        }
        getRef(){
            return firebaseApp.database().ref();
        }
    render() {
        const {labelStyle, textStyle} = styles;
        const {navigate} = this.props.navigation;
        let workout = this.state.workout;
        let sets = this.state.sets;

        return (
               <View >
               <Card>
                   <CardSection>
                       <Text style={labelStyle}>Workout</Text>
                   </CardSection>
                   <CardSection>
                       <Input
                           label="Workout"
                           value={this.state.workout}
                           placeholder="Add Workout"
                           onChangeText={(workout)=>this.setState({workout:workout})}
                       />
                   </CardSection>
                   <CardSection>
                       <Text style={labelStyle}>Sets and Reps</Text>
                   </CardSection>
                   <CardSection>
                       <MultilineInput
                       style={textStyle}
                       multiline={true}
                       numberOflines= {40}              
                       onChangeText = {(sets)=>this.setState({sets:sets})}
                       value = {this.state.sets}
                       />
                    </CardSection> 
             </Card>
             <Button
                    onPress={() => {
                        if(this.state.workout === "" && this.state.sets==="")
                        {
                            return;
                        }
                        var d = new Date();
                        this.workoutsRef.push({title:this.state.workout,subtitle:this.state.sets,
                            date:(d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear(),
                        });
                        //this.props.navigation.navigate('Home');
                        }}
                        title="Save Workout"
                />
           </View>
        );
    }
}
class WorkoutList extends Component {
    constructor (props) {
        super(props);
        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            workoutDataSource: ds,
            modalVisible: false,
            workout:'',
            sets:'',
            date:'',
        }
        this.workoutsRef = this.getRef().child('workouts');
        this.renderRow= this.renderRow.bind(this);
        this.pressRow= this.pressRow.bind(this);

        }
    getRef(){
        return firebaseApp.database().ref();
    }
    getWorkouts(workoutsRef){
        // let workouts = [{title:'Workout One'},{title:'Workout Two'}];
 
         workoutsRef.on('value',(snap)=>{
             let workouts = [];
 
             snap.forEach((child)=>{
                 workouts.push({
                     title: child.val().title,
                     subtitle:child.val().subtitle,
                     date:child.val().date,
                     _key: child.key
                 });
             });
             
             this.setState({
                 workoutDataSource: this.state.workoutDataSource.cloneWithRows(workouts)
             });
         });
     }
     componentWillMount(){
         this.getWorkouts(this.workoutsRef);
     }
     componentDidMount(){
        this.getWorkouts(this.workoutsRef);
     }
    addWorkout(){
        this.props.navigation.navigate('Workout');
    }
    editWorkout(newVal,index){
        let workout = this.state.workouts[index];
        let newWorkout = Object.assign(workout,{[key]:newVal});
        let oldWorkouts = this.state.workouts;
        oldWorkouts[index]=newWorkout;

        this.setState({
            workouts:oldWorkouts,
            updateInput:newWorkout 
        })
    }
    updateWorkout=()=>{
        let object = this.state.updateInput;
        e.preventDefault();
        workoutsRef.child(object.firebaseUrl).once("value",function(snapshot){
            snapshot.ref.update({
                workout:object.workout,
                sets:object.sets
            },()=>{
                console.log("record updated");
            })
        });
    }
    
    setModalVisible(visible){
        this.setState({modalVisible : visible});
    }
    pressRow(workout){
        //this.workoutsRef.child(workout._key).remove();
       // this.setModalVisible(true);
        this.props.navigation.navigate('Edit');
      }
    renderRow(workout){
        const {container,textStyle,subTextStyle}=styles;
        return(
            <TouchableHighlight onPress={()=>{this.pressRow(workout);}}
               // onLongPress={()=>{this.workoutsRef.child(workout._key).remove();}}
            >
            <View style={container}>
               <Card>
                    <CardSection>
                            <Text style={textStyle}>{workout.title}</Text>
                        </CardSection>
                        <CardSection>
                            <Text style={subTextStyle}>{workout.date}</Text>
                    </CardSection> 
               </Card>
            </View>
         </TouchableHighlight>
        );
    }
    render() {
        const {labelStyle, subTextStyle,container,textStyle,addButtonStyle,addButtonTextStyle} = styles;
        let workout = this.state.workout;
        let sets = this.state.sets;
        return(
            <View>
                 <Modal
              visible={this.state.modalVisible}
              transparent={false}
              animationType={'slide'}
              onRequestClose={() => {}}
          >
            <View >
                <Card>
              <View >
                    <CardSection>
                        <Text style={labelStyle}>Edit Workout</Text>
                    </CardSection>
                    <CardSection>
                        <Input
                            label="Workout"
                            value={this.state.workout}
                            placeholder="Add Workout"
                            onChangeText={(workout)=>this.editWorkout(workout.target.value,workout)}
                        />
                    </CardSection>
                    <CardSection>
                        <Text style={labelStyle}>Sets and Reps</Text>
                    </CardSection>
                    <CardSection>
                        <MultilineInput
                        style={textStyle}
                        multiline={true}
                        numberOflines= {40}              
                        onChangeText = {(sets)=>this.editWorkout(sets.target.value,sets)}
                        value = {sets}
                        />
                     </CardSection> 
              </View>
              </Card> 
            </View>
            <Button
                    onPress={() => {
                        this.workoutsRef.push({title:this.state.workout,subtitle:this.state.sets});
                        this.updateWorkout
                        this.setModalVisible(!this.state.modalVisible)}}
                        title="Save Workout"
                />
          </Modal>   
             <Card>
                            <ListView
                                enableEmptySections
                                dataSource={this.state.workoutDataSource}
                                renderRow={this.renderRow}
                            />
            </Card>     
            </View>    
        );
    }
}
class WorkoutEdit extends Component {
   constructor (props){
       super(props);
       this.state = {
        workout:this.props.title,
        sets:this.props.subtitle,
        date:'',
        itemKey: this.props._key,
       };
      // this.workoutsRef = this.getRef().child('workouts');
   }
   componentDidMount(){
       this.getRef().child('workouts').on('child_added'/*'child_added'*/,s=>{
           if(s.exists()){
               console.log(s.val()) //it will return the new updated object
               console.log(s.key) //it will return the timestamp key
               this.setState({
                workout:s.val().title,
                sets:s.val().subtitle,
                date:s.val().date,
               });
           }
       })
   }
   getWorkoutsRef= () => {
    this.getRef().child('workouts').child(this.state.itemKey);
   }
   getRef(){
    return firebaseApp.database().ref();
    }
    updateWorkout = () => {
        this.getWorkoutsRef().update(
          { 
               title : this.state.workout,
               subtitle: this.state.sets,
               date:this.state.date,
        }
        );
    }
   render(){
    const {labelStyle,textStyle,addButtonStyle,addButtonTextStyle} = styles;
       return(
        <View >
        <Card>
            <CardSection>
                <Text style={labelStyle}>Workout</Text>
            </CardSection>
            <CardSection>
                <Input
                    label="Workout"
                    value={this.state.workout}
                    placeholder="Add Workout"
                    onChangeText={(workout)=>this.setState({workout})}
                />
            </CardSection>
            <CardSection>
                <Text style={labelStyle}>Sets and Reps</Text>
            </CardSection>
            <CardSection>
                <MultilineInput
                style={textStyle}
                multiline={true}
                numberOflines= {40}              
                onChangeText = {(sets)=>this.setState({sets})}
                value = {this.state.sets}
                />
             </CardSection> 
      </Card>
      <Button
             onPress={() => {
                 if(this.state.workout === "" && this.state.sets==="")
                 {
                     return;
                 }
                 this.updateWorkout
                 //this.props.navigation.navigate('Home');
                 }}
                 title="Edit Workout"
         />
    </View>
       );
   }
}

class HomeScreen extends Component {
    static navigationOptions = ({navigation}) => {
        const{addButtonStyle,addButtonTextStyle}=styles;
      return {
        title: 'Sets',
        headerRight: ( 
            <TouchableHighlight style={addButtonStyle} onPress={()=>{navigation.navigate('Workout');}}>
                <Text style={addButtonTextStyle}>+</Text>
            </TouchableHighlight>
        ),
      };
    };
    render() {
        const {navigate} = this.props.navigation;
        return(
            <View>
                <WorkoutList {...this.props}/> 
            </View>
        ); 
    }
}

class WorkoutScreen extends Component {
    static nagivationOptions = ({navigation}) => ({
        //nav options can be defined as a function of the screen's props:
        title: `Workout with ${navigation.state.params.user}`,
        

    });

    render() {
        //the screen's current route is passed into `props.navigation.state`
        const {params} = this.props.navigation.state;
        return(
            <View>
                 <WorkoutCreate {...this.props}/>  
            </View>
        ); 
    }
}
class WorkoutEditScreen extends Component {
    render(){
        const{addButtonStyle,addButtonTextStyle}=styles;
        return(
            <View>
                    <WorkoutEdit {...this.props}/>
            </View>
        );
    }
}
//TabNavigation
class RecentWorkoutScreen extends Component  {
    render() {
        return(
            <View>    
                <WorkoutList {...this.props}/>              
            </View>
        ); 
    }
}

class TimerSet extends Component{
    //https://www.npmjs.com/package/react-native-stopwatch-timer
    constructor(props) {
        super(props);
        this.state = {
          timerStart: false,
          totalDuration:null,
          timerReset: false,
        };
        this.toggleTimer = this.toggleTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
    }
    
  toggleTimer() {
    this.setState({timerStart: !this.state.timerStart, timerReset: false});
  }
 
  resetTimer() {
    this.setState({timerStart: false, timerReset: true});
  }
  getFormattedTime(time) {
    this.currentTime = time;
};

render(){
    const {buttonStyle,TimerStyle} = styles;
    let totalDuration = this.state.totalDuration;
    return(
    <View>
        <Card>
            <CardSection>
                <Input
                        value = {this.state.totalDuration}
                        onChangeText={(totalDuration)=>this.setState({totalDuration:totalDuration})}
                        label="Seconds"
                />
            </CardSection>
            <CardSection>
            <Timer
                totalDuration={this.state.totalDuration} 
                secs start={this.state.timerStart}
                reset={this.state.timerReset}
                getTime={this.getFormattedTime}
            />
            </CardSection>
            <CardSection>
                <View style={buttonStyle}> 
                    <Button
                onPress={this.toggleTimer}
                title={!this.state.timerStart ? "Start" : "Stop"}
                />
                <Button 
                onPress={this.resetTimer}
                title="Reset"
                />
                 </View> 
            </CardSection>      
        </Card>         
    </View>   
    );
    }
}

class TimerScreen extends Component  {
    render() {
        return(
            <View>
               <TimerSet {...this.props} />
            </View>
        ); 
    }
}

const MainScreenNavigator = TabNavigator ({
Workouts: {screen:HomeScreen},
Timer: {screen: TimerScreen},
});

//nesting a tab navigator in a stack navigator
 const App = StackNavigator({
    Home: {screen: MainScreenNavigator,
   /* navigationOptions:{
        title: 'Sets',
        }*/
    },
    Workout: {screen:WorkoutScreen,
    navigationOptions: {
        title: 'Add Workout',
        
     },
    },
    Edit:{
        screen: WorkoutEditScreen,
        navigationOptions: {
            title:'Edit Workout'
        },
    },
});

const styles = StyleSheet.create({
    labelStyle: {
      flex: 1,
      backgroundColor: '#fff',
      fontSize: 18,
      textAlign: 'center'
    },
    container:{
        flex:1,
        backgroundColor:'white',
    },
    textStyle: {
        fontSize: 16,
        backgroundColor:'white',
        fontSize: 18,
        paddingLeft: 15,
        color:'black',
        
    },
    subTextStyle:{
        fontSize:14,
        paddingLeft:15,
    },
    buttonStyle: {
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        width: '40%'
    },
    addButtonStyle:{
        borderRadius:64,
        height:50,
        width:50,
        backgroundColor:'gray',
        marginRight:15,
        justifyContent:'center',
    },       
    addButtonTextStyle:{
        color:'blue',
        fontSize:18,
        alignSelf:'center',
    }
  });

export default App;