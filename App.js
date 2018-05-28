import React from "react";
import {
	StyleSheet,
	View,
	SafeAreaView,
	StatusBar,
	ScrollView,
	Linking
} from "react-native";
import { Button, Input, Text, ListItem } from "react-native-elements";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = { list: [], name: "", link: "" };
		this.inputName = React.createRef();
	}

	_onSubmit = () => {
		const { list, name, link } = this.state;

		if (name.length && link.length) {
			this.setState({ list: list.concat({ name, link }), name: "", link: "" });
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
		const { list, name, link } = this.state;
		return (
			<View style={styles.container}>
				<ScrollView>
					<StatusBar hidden />
					<SafeAreaView>
						<Text h2 style={styles.heading}>
							Dark Mode List
						</Text>
						<View style={styles.formWrapper}>
							<Text style={styles.label}>Name</Text>
							<Input
								autoCapitalize="none"
								ref={this.inputName}
								value={name}
								onChangeText={this._onChangeName}
								inputStyle={styles.input}
								errorStyle={styles.error}
								errorMessage={!name.length ? "Please enter app name" : ""}
							/>

							<Text style={styles.label}>URL</Text>
							<Input
								autoCapitalize="none"
								value={link}
								onChangeText={this._onChangeLink}
								inputStyle={styles.input}
								errorStyle={styles.error}
								errorMessage={!link.length ? "Please enter the url link" : ""}
							/>

							<Button
								title="Submit"
								onPress={this._onSubmit}
								buttonStyle={styles.btn}
							/>

							{list.length && (
								<View>
									{list.map((l, i) => (
										<ListItem
											key={i}
											title={l.name}
											subtitle={l.link}
											style={styles.listItem}
											containerStyle={{
												backgroundColor: (i + 1) % 2 ? "#2c3979" : "#3c485e"
											}}
											titleStyle={{ color: "white", fontWeight: "bold" }}
											subtitleStyle={{ color: "white" }}
											onPress={() => Linking.openURL(l.link)}
										/>
									))}
								</View>
							)}
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
		fontSize: 16,
		color: "#fb6794"
	},
	btn: {
		backgroundColor: "#fb6794",
		marginTop: 10
	},
	listItem: {
		marginTop: 15
	}
});

export default App;
