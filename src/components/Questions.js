import React from 'react';
import { Slider, View } from 'react-native';
import { Content, Container, Picker, Body, ListItem, CheckBox, Text, Input, Label, Item} from "native-base";

export class TextQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  componentDidMount(){
    this.setState({value: this.props.question.defaultValue});
  }

  getVal(){
    return [this.state.value];
  }

  reset(){
    this.setState({value: this.props.question.defaultValue})
  }

  render() {
    let question = this.props.question;

    return (
      <View style={{borderColor: 'black', borderWidth: 1, margin: 1}}>
        <Item floatingLabel>
          <Label> {question.label} </Label>
          <Input value={this.state.value} onChangeText={(val)=> {this.setState({ value: val })}}/>
        </Item>
      </View>
    )
  }
}

export class OptionsQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: ""
    };
  }

  componentDidMount(){
    this.setState({
      selected: this.props.question.options[0]
    });
  }

  onValueChange(value: string) {
    this.setState({
      selected: value
    });
  }

  getVal(){
    return [this.state.selected];
  }

  reset(){
    this.setState({
      selected: this.props.question.options[0]
    });
  }

  render() {
    const question =  this.props.question;
    const items = [];
    question.options.forEach((o) =>{
      items.push(<Picker.Item key={question.id+'-'+o} label={o} value={o}/>);
    });

    return (
      <Content style={{borderColor: 'black', borderWidth: 1, margin: 1}}>
        <Text> {question.label} </Text>
        <Picker
          header="Select one"
          mode="dropdown"
          selectedValue={this.state.selected}
          onValueChange={this.onValueChange.bind(this)}
          style={{width: '100%'}}
        >
        {items}
        </Picker>
      </Content>
    );
  }
}

export class NumbersQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  componentWillMount(){
    this.setState({value: this.props.question.minVal});
  }

  changeVal(val){
    this.setState({value:val});
  }

  getVal(){
    return [this.state.value];
  }

  reset(){
    this.setState({value: this.props.question.minVal});
  }

  render() {
    let question = this.props.question;
    return (
      <Content style={{borderColor: 'black', borderWidth: 1, margin: 1}}>
        <Text> {question.label} </Text>
        <Slider value={this.state.value} onValueChange={(val)=>this.changeVal(val)} minimumValue={question.minVal} maximumValue={question.maxVal} step={question.step}/>
        <Text style={{textAlign: 'center'}}> {this.state.value} </Text>
      </Content>
    )
  }
}

export class CheckBoxQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: []
    };
  }

  check(o){
    let temp = false;
    this.state.checked.forEach((chk) =>{
      if(chk == o)
        temp = true;
    });
    return temp;
  }

  getIndex(val){
    let index;
    for(index = 0 ; index < this.state.checked.length ; index++){
      if(this.state.checked[index] == val)
        break;
    }
    return index;
  }

  reset(){
    this.setState({checked: []})
  }

  getVal(){
    return this.state.checked;
  }

  changeVal(val){
    let newArray = this.state.checked;
    if(this.check(val))
      newArray.splice(this.getIndex(val),1);
    else
      newArray.push(val);
    this.setState({checked: newArray});
  }

  render() {
    let question = this.props.question;
    let items = [];
    question.options.forEach((o) => {
      items.push(
        <ListItem key={question.id + '-' + o} onPress={() => this.changeVal(o)}>
          <CheckBox onPress={() => this.changeVal(o)} checked={this.check(o)} color="green"checked={this.check(o)} color="green"/>
          <Body>
            <Text> {o} </Text>
          </Body>
        </ListItem>
      );
    });
    return (
      <Content style={{borderColor: 'black', borderWidth: 1, margin: 1}}>
        <Text> {question.label + ' (check all that applies)'} </Text>
        {items}
      </Content>
    )
  }
}
