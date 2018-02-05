import React, {Component} from 'react';
import {AppRegistry,View,TextInput,Text}  from 'react-native';

class MultilineInput extends Component {
    render() {
        return(
                <TextInput
                {...this.props} //inherit any props passed to it
                editable = {true}
                maxLength = {350}
                />   
        );
    }
      
}

class MultilineInputForm extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            text: 'Sets and reps',
        };   
    }
}
/*
const styles = {
    inputStyle: {
        color: '#000',
        paddingRight: 5,
        paddingLeft: 5,
        fontSize: 18,
        lineHeight: 23,
        flex: 2
        
    },
    labelStyle: {
        fontSize: 18,
        paddingLeft: 20,
        flex: 1
    },
    containerStyle: {
        height: 40,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
};*/

export default MultilineInput;