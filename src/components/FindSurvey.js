// full code here --> https://github.com/bizz84/redux-navigation-color-picker
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Footer, Content, Button, Icon, Text, Row, Form, Label, Input, Item, Fab, Spinner, Toast} from 'native-base';
import { addToRecentSurvey } from '../actions/netActions';

class FindSurvey extends Component {
  static navigationOptions = {
    title: 'Find Survey',
  };

  componentWillMount(){
    this.state = {
      surveyId: '',
      isLoading: false,
      cancel: false
    }
  }

  search(){
    let id = this.state.surveyId;
    if(id == '' ){
      Toast.show({
        text: "SurveyId is required!",
        buttonText: "Okay",
        buttonTextStyle: { color: "#008000" },
        buttonStyle: { backgroundColor: "#5cb85c" },
        duration: 3000
      })
      return;
    }
    this.setState({ surveyId: '', isLoading: true, cancel: false});
    fetch('https://stormy-forest-11115.herokuapp.com/api/survey/'+id)
    .then((res) => {
      if(res.status != 200)
        throw res;
      else
        return res.json();
    })
    .then((survey) => {
      if(!this.state.cancel) {
        let here = false;
        this.props.recentSurveys.forEach((rs) => {
          if(rs.id == survey.id)
            here = true;
        })

        if(!here) this.props.dispatch(addToRecentSurvey(survey));
        this.props.navigation.navigate('Survey', {survey:survey});
      }
      this.setState(previousState => { return { surveyId: '', isLoading: false, cancel: false } });
    })
    .catch((err) =>{
      if(!this.state.cancel){
        if(err.status == 404)
          Toast.show({
            text: "Survey Not Found",
            buttonText: "Okay",
            buttonTextStyle: { color: "#008000" },
            buttonStyle: { backgroundColor: "#5cb85c" },
            duration: 3000
          })
        else
          Toast.show({
            text: "Server Error",
            buttonText: "Okay",
            buttonTextStyle: { color: "#008000" },
            buttonStyle: { backgroundColor: "#5cb85c" },
            duration: 3000
          })
      }
      this.setState(previousState => { return { surveyId: '', isLoading: false, cancel: false } });
    })
  }

  cancel(){
    this.props.navigation.goBack();
  }

  cancelSearch(){
    this.setState(previousState => {
      return { surveyId: previousState.surveyId, isLoading: false, cancel:true }
    });
  }

  render() {
    if(this.state.isLoading)
      return(
        <Container>
          <Content>
              <Spinner color='#c43aea'/>
          </Content>
          <Fab style={{ backgroundColor: '#e8542c' }} position="bottomRight" onPress={() => this.cancelSearch()}>
            <Icon name="md-close" />
          </Fab>
        </Container>
      )
    else
      return (
        <Container>
          <Content>
            <Form>
              <Item inlineLabel error>
                <Label>Survey Id</Label>
                <Input onChangeText={(val)=> {
                  this.setState(previousState => {
                    return { surveyId: val, isLoading: previousState.isLoading };
                  })}}/>
                <Text style={{ color: 'red' }}> {this.state.surveyId == ''? 'Required' : ' '} </Text>
              </Item>
            </Form>
            <Row style={{ width: '100%', height: '10%', margin:'10%'}}>
              <Button style={{margin: 5}} onPress={this.search.bind(this)} success >
                <Text> Find Survey </Text>
              </Button>
              <Button style={{margin: 5}} onPress={this.cancel.bind(this)} danger>
                <Text> Cancel </Text>
              </Button>
            </Row>
          </Content>
        </Container>
      )
  }
}

const mapStateToProps = state => ({ recentSurveys: state.survey.recentSurveys});

export default connect(mapStateToProps)(FindSurvey);
