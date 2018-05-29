import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Linking,
  ActivityIndicator
} from "react-native";
import { Button, Input, Text, ListItem } from "react-native-elements";
import AWSAppSyncClient from "aws-appsync";
import { Rehydrated } from "aws-appsync-react";
import { ApolloProvider, Query, Mutation, Subscription } from "react-apollo";
import uuid from "uuid/v4";

import CREATE_APP from "./src/mutations/CreateApp";
import LIST_APPS from "./src/queries/ListApps";
import NEW_APP from "./src/subscriptions/NewApp";

import appSyncConfig from "./AppSync";

const client = new AWSAppSyncClient({
  url: appSyncConfig.graphqlEndpoint,
  region: appSyncConfig.region,
  auth: {
    type: appSyncConfig.authenticationType,
    apiKey: appSyncConfig.apiKey
  }
});

const Loading = () => <ActivityIndicator size="large" color="#fff" />;
const Error = ({ text }) => (
  <Text h4 style={[styles.error, styles.centerText]}>
    {text}
  </Text>
);
const renderLI = (item, i) => {
  if (typeof item !== "object") return;
  const { id, name, link } = item;
  return (
    <ListItem
      key={id}
      title={name}
      subtitle={link}
      style={styles.listItem}
      containerStyle={{
        backgroundColor: (i + 1) % 2 ? "#2c3979" : "#3c485e"
      }}
      titleStyle={{ color: "white", fontWeight: "bold" }}
      subtitleStyle={{ color: "white" }}
      onPress={() => Linking.openURL(link)}
    />
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", link: "" };
    this.inputName = React.createRef();
  }

  _onSubmit = createApp => {
    const { name, link } = this.state;

    if (name.length && link.length) {
      this.setState({ name: "", link: "" });
      createApp({ variables: { id: uuid(), name, link } });
      this.inputName.current.focus();
    }
  };

  _onChangeName = name => {
    this.setState({ name });
  };

  _onChangeLink = link => {
    this.setState({ link });
  };

  render() {
    const { name, link } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          <StatusBar hidden />
          <SafeAreaView>
            <Text h2 style={styles.heading}>
              Dark Mode List
            </Text>
            <View style={styles.formWrapper}>
              <Mutation
                mutation={CREATE_APP}
                optimisticResponse={{
                  __typename: "AppConnection",
                  createApp: {
                    __typename: "App",
                    id: Math.round(Math.random() * -1000000),
                    name,
                    link
                  }
                }}
                update={(cache, { data: { createApp } }) => {
                  const data = cache.readQuery({ query: LIST_APPS });
                  if (typeof createApp.id === "number")
                    data.listApps.items.push(createApp);
                  cache.writeQuery({
                    query: LIST_APPS,
                    data
                  });
                }}
              >
                {createApp => (
                  <React.Fragment>
                    <Text style={styles.label}>Name</Text>
                    <Input
                      autoCapitalize="none"
                      ref={this.inputName}
                      value={name}
                      onChangeText={this._onChangeName}
                      inputStyle={styles.input}
                      errorStyle={[styles.error, styles.errorFontSize]}
                      errorMessage={!name.length ? "Please enter app name" : ""}
                    />

                    <Text style={styles.label}>URL</Text>
                    <Input
                      autoCapitalize="none"
                      value={link}
                      onChangeText={this._onChangeLink}
                      inputStyle={styles.input}
                      errorStyle={[styles.error, styles.errorFontSize]}
                      errorMessage={
                        !link.length ? "Please enter the url link" : ""
                      }
                    />

                    <Button
                      title="Submit"
                      onPress={() => this._onSubmit(createApp)}
                      buttonStyle={styles.btn}
                    />
                  </React.Fragment>
                )}
              </Mutation>

              <Query query={LIST_APPS} fetchPolicy="cache-and-network">
                {({ loading, error, data }) => {
                  if (loading) return <Loading />;
                  if (error) return <Error text="Error listing apps :(" />;
                  if (!data.listApps.items.length)
                    return <Error text="Current List is Empty" />;
                  return (
                    <React.Fragment>
                      {data.listApps.items.map(renderLI)}
                      <Subscription subscription={NEW_APP}>
                        {({ loading, error, data }) => {
                          if (loading) return null;
                          if (error)
                            return (
                              <Error text="Error subscribing to new app" />
                            );
                          return renderLI(data.onCreateApp, 0);
                        }}
                      </Subscription>
                    </React.Fragment>
                  );
                }}
              </Query>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#21272e"
  },
  formWrapper: {
    padding: 10
  },
  heading: {
    textAlign: "center",
    color: "white"
  },
  label: {
    marginLeft: 5,
    fontSize: 20,
    color: "white"
  },
  input: {
    color: "#bababa"
  },
  error: {
    color: "#fb6794"
  },
  errorFontSize: {
    fontSize: 16
  },
  btn: {
    backgroundColor: "#fb6794",
    marginVertical: 10
  },
  listItem: {
    marginTop: 15
  },
  centerText: {
    textAlign: "center"
  }
});

const WithProvider = () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <App />
    </Rehydrated>
  </ApolloProvider>
);

export default WithProvider;
