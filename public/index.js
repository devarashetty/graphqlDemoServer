import React,{Component} from 'react';
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


class Pokedex extends React.Component {
  constructor(props){
    super(props);
  }

  render () {   
    console.log("------t",this.props)
    return (
      <div className='w-100 bg-light-gray min-vh-100'>
        <div className='tc pa5'>
          Hey  there are 0 Pokemons in your pokedex
        </div>
     </div>
    )
  }
}

const PokedexWithData = graphql(TrialQuery)(Pokedex);


const networkInterface = createNetworkInterface('http://localhost:8000/graphql');

const wsClient = new SubscriptionClient(`ws://localhost:5000/`, {
  reconnect: true,
  connectionParams: {
      // Pass any arguments you want for initialization
  }
}); 

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

console.log("=================wsClient",wsClient);

const apolloClient = new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions
})

var testingSub = wsClient.subscribe(
  {
    query:'\
      subscription {\
          authorAdded {\
              id\
          }\
      }',
    
    variables:{},
    operationName:"testingSub"
  },
  function (errors: Error[], result?: any) {
    console.log("--------------------err",errors);
    console.log("--------------res",result)
  }
)

console.log("-----------------testingSub",testingSub);
class App extends React.Component  {

  constructor(...args) {
    super(...args);
    // apolloClient.subscribe({
    //   querykey:  gql`
    //       subscription testing {
    //           authors {
    //               id
    //           }
    //       }`,
    // })
  }

  componentDidMount(){
   
  }

  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <PokedexWithData />
      </ApolloProvider>
    );
  }
}

export default App;

ReactDom.render(<App/>,
  document.getElementById('root')
)