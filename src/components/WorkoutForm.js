import React, { Component } from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
//import {workoutUpdate} from '../actions';
import CardSection from './CardSection';
import Input from './Input';

class WorkoutForm extends Component {
    render(){
        return (
            <View>
                <CardSection>
                    <Input
                        label = "Workout"
                        placeholder = "Biceps and Legs"
                        value = {this.props.workout}
                        onChangeText = {value => this.props.workoutUpdate({prop:'workout',value})}
                    />
                </CardSection>   
            </View>
        );
    }
}

const mapStateToProps = (state) => {

    const {workout} = state.workoutForm;
    return {workout};
};

export default connect(mapStateToProps, {})(WorkoutForm);