import React,{Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter,Route} from 'react-router-dom'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { PubSub, SubscriptionManager } from 'graphql-subscriptions';

import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws';


const TrialQuery = gql`
  query  {
    author(_id:\"indi\") {
    	name
    }
  }
`
const TrialQuery2 = gql`
  mutation ($user:String!){
    createAuthor(name:$user,_id:$user,twitterHandle:$user){
      name
    }
  }
`

class Pokedex extends React.Component {
  constructor(props){
    super(props);
    this.onClick = this.onClick.bind(this);    
  }
  
  onClick(){
    console.log("----------------",this.props)
    this.props.mutate({variables:{user:"sairam"}}).then(function (data) {
      console.log("----------------------data",data).catch((error) => {
        console.log('there was an error sending the query', error);
      });
    })
  }

  render () {   
    return (
        <div className='tc pa5' onClick={this.onClick}>
          Hey  there are 0 Pokemons in your pokedex
        </div>
    )
  }
}

const PokedexWithData = graphql(TrialQuery2)(Pokedex);
const networkInterface = createNetworkInterface({
  uri:'http://localhost:8000/graphql',
  opts: {
    mode: 'no-cors',
  },
});

class App extends React.Component  {
  
  constructor(...args) {
    super(...args);

    this.apolloClient = new ApolloClient({
      networkInterface: networkInterface
    })
  }

  render() {
    return (
      <ApolloProvider client={this.apolloClient}>
        <PokedexWithData />
      </ApolloProvider>
    );
  }
}

export default App;

ReactDom.render(<App/>,
  document.getElementById('root')
)