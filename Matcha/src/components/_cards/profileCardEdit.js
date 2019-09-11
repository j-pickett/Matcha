import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import { CardHeader, CardMedia, CardContent,
		Typography, CardActions, IconButton, makeStyles, ButtonBase,
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import {doMongoDBGetProfileWithAuth, doMongoDBGetUserWithAuthEmail} from '../axios';
import TextBio from '../formPage/textfield';
import Chips from '../formPage/formbuttons/interests.js';
import MatchGender from '../formPage/formbuttons/matchgender';
import MyGender from '../formPage/formbuttons/yourgender';
import ImageCard from './imagecard';
import {LocationDisplay} from '../location';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
	card: {
		display: 'flex',
		maxWidth: 800,
		backgroundColor: "transparent",
	},
	media: {
		height: 10,
		paddingTop: '56.25%',
	},
}))

const ProfileCardStuff = ({profile, authUser, changeState}) => {
	const classes = useStyles();
	const clicked = () => window.alert(profile);
	let value = "";

	const checkStage = val => {
			
	}

	const Save = ({profile}) => {
		const updateProfile = process.env.REACT_APP_AXIOS_UPDATE_PROFILE;
			const a = () => axios.put(updateProfile, profile);
		return(
			<ButtonBase onClick={a}>yeah yeah</ButtonBase>
		)
	}

	return(
		<div>
			<Card className={classes.card}>
				<CardHeader
					title={profile.fame}
					subheader={ profile ? profile.mystats.bio : value }
					/>
				<CardContent >
				</CardContent>
			</Card>
					<Chips profile={profile} checkStage={checkStage}/>
					<TextBio profile={profile} checkStage={checkStage} />
					<MyGender profile={profile} checkStage={checkStage} />
					<MatchGender profile={profile} checkStage={checkStage} />
					<ImageCard profile={profile} authUser={authUser} changeState={changeState}/>
					<LocationDisplay profile={profile} />
					<Save profile={profile} />
					
		</div>
	);

}

class ProfileCardEdit extends Component{
	constructor(props){
		super(props);

		this.state = {
			authUser: this.props.authUser,
			loading: true,
			profile: this.props.authUser.profile,
		};
	}

	// getUser = () => {
	// 	let userObj = {};
	// 	const wat = doMongoDBGetUserWithAuthEmail(this.props.authUser).
	// 	then(async (res) => {
	// 		userObj = res;
	// 		// console.log(userObj);
	// 		this.setState({userObj})
	// 		return res;	
	// 	})
	// }

	// getProfile = () => {
	// 	let profileObj = {};
	// 	// console.log(this.state.userObj.username)
	// 	const wat = doMongoDBGetProfileWithAuth(this.state.userObj.username).
	// 	then(async (res) => {
	// 		profileObj = res;
	// 		this.setState({profileObj});
	// 		return res;
	// 	})
	// }

	async componentDidMount() {
		this.setState({loading: false});

	};
	
	render() {
		const {
			authUser,
			loading,
			profile,
		} = this.state;

		return (
			<div>
				{
					loading ? 
					<p>Loading...</p> : 
					<ProfileCardStuff profile={profile} authUser={authUser}changeState={this.props.changeState}/> 
				} 
			</div>
		)
	}
}

export default ProfileCardEdit;