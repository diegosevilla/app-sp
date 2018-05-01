// full code here --> https://github.com/bizz84/redux-navigation-color-picker
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, List, ListItem, Tab, Tabs, Footer, Content, Button, Icon, Text, Row, Form, Label, Input, Item, Fab, Spinner, Toast} from 'native-base';
import { findSurvey } from '../actions/appActions';
import _ from 'lodash';
import ignoreCase from 'ignore-case';

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

    fetch('https://josevilla-sp.herokuapp.com/api/survey/')
    .then((res)=>res.json())
    .then((surveys) => {
      this.setState({surveys: surveys})
    })
    .catch((err)=>{
      Toast.show({
        text: "Error fetching surveys",
        buttonText: "Okay",
        buttonTextStyle: { color: "#008000" },
        buttonStyle: { backgroundColor: "#5cb85c" },
        duration: 3000
      });
      this.setState({surveys: -1})
    })
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
    const initialSurveys = _.sortBy(this.state.surveys, [function(s) { return s.id; }]);
    const surveyName = this.state.surveyName;
    const surveys = initialSurveys != -1? _.filter(initialSurveys, function(s){return ignoreCase.includes(s.surveyName, surveyName)}) : [];
    const listOfSurveys = [];

    surveys.forEach((survey)=>{
      listOfSurveys.push(
        <ListItem onPress={ () => { this.clickListItem(survey.surveyId) } }>
          <Row style={{width: '100%'}}>
            <Text> {survey.surveyName} </Text>
          </Row>
          <Row style={{width: '100%'}}>
            <Text style={{fontSize: 12}}> {survey.author} </Text>
          </Row>
        </ListItem>
      );
    });

    const tab2 = [];
    if(initialSurveys.length == 0){
      tab2.push(
          <Content>
            <Spinner color='#96b2dd'/>
            <Text style={{textAlign: 'center'}}> Fetching surveys </Text>
          </Content>
       );
    } else if(initialSurveys == -1){
      tab2.push(
        <Content>
          <Text style={{textAlign: 'center'}}> Error fetching surveys </Text>
        </Content>
      );
    } else {
      tab2.push(
        <Content>
          <List>
            {listOfSurveys}
          </List>
        </Content>
      )
    }

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
                  <Item inlineLabel error={(this.state.surveyId =='')}>
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
              <Header searchBar rounded>
                <Item>
                  <Icon small name="search" />
                  <Input placeholder="Search via Survey Title" onChangeText={((val) =>{this.setState( {surveyName: val} )})}/>
                </Item>
                <Button small onPress={this.cancel.bind(this)} transparent>
                  <Text> Cancel </Text>
                </Button>
              </Header>
              {tab2}
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
