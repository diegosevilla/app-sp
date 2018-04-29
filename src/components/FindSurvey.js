// full code here --> https://github.com/bizz84/redux-navigation-color-picker
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, List, ListItem, Tab, Tabs, Footer, Content, Button, Icon, Text, Row, Form, Label, Input, Item, Fab, Spinner, Toast} from 'native-base';
import { findSurvey } from '../actions/netActions';

class FindSurvey extends Component {
  static navigationOptions = {
    title: 'Find Survey',
  };

  componentWillMount(){
    this.state = {
      surveyId: '',
      isLoading: false,
      cancel: false,
      surveyName: '',
      surveys: []
    }

    fetch('https://stormy-forest-11115.herokuapp.com/api/survey/')
    .then((res)=>res.json())
    .then((surveys) => {
      this.setState({surveys: surveys})
    });
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
    const { dispatch } = this.props;

    dispatch(findSurvey(id)).then((res)=>{
      if(!this.state.cancel){
        if(res.code == 200){
          this.props.navigation.navigate('Survey');
        }else {
          Toast.show({
            text: res.err,
            buttonText: "Okay",
            duration: 3000
          })
        }
      }
      this.setState({surveyId: '', isLoading: false, cancel: false})
    })
  }

  clickListItem(surveyId){
    const { dispatch } = this.props;
    this.setState({ surveyId: '', isLoading: true, cancel: false});
    dispatch(findSurvey(surveyId)).then((res)=>{
      if(!this.state.cancel){
        if(res.code == 200){
          this.props.navigation.navigate('Survey');
        }else {
          Toast.show({
            text: res.err,
            buttonText: "Okay",
            duration: 3000
          })
        }
      }
      this.setState({surveyId: '', isLoading: false, cancel: false})
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
    const surveys = this.state.surveys;
    const listOfSurveys = [];

    surveys.forEach((survey)=>{
      listOfSurveys.push(
        <ListItem onPress={ () => { this.clickListItem(survey.surveyId) } }>
          <Text> {survey.surveyName} </Text>
        </ListItem>
      );
    })
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
          <Tabs initialPage={0}>
            <Tab heading="Search via SurveyId">
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
            </Tab>
            <Tab heading="Browse Existing Survey">
              <Button style={{width: '100%'}} onPress={this.cancel.bind(this)} danger>
                <Text> Cancel </Text>
              </Button>
              <Content>
                <List>
                  { listOfSurveys}
                </List>
              </Content>
            </Tab>
          </Tabs>
        </Container>
      )
  }
}

const mapStateToProps = state => {
  return {
    recentSurveys: state.app.recentSurveys,
    survey: state.app.survey
  };
};


export default connect(mapStateToProps)(FindSurvey);
