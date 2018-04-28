import React from 'react';
import { View, Picker} from 'react-native';
import { FormLabel, FormInput , Button, Text } from 'react-native-elements';

export default class Options extends React.Component {
  render() {
    let question = this.props.question;
    let items = [];
    question.options.forEach((o) => {
      items.push(<Picker.Item label={o} value={o}/>)
    });
    return (
      <View>
        <Text> {question.label} </Text>
        <Picker>
          {items}
        </Picker>
      </View>
    )
  }
}
