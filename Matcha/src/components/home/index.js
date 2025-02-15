import React, { Component } from 'react';
import { compose } from 'recompose';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import ThumbUp from '@material-ui/icons/ThumbUp';
import ShareIcon from '@material-ui/icons/Share';
import SaveIcon from '@material-ui/icons/Save';
import CommentIcon from '@material-ui/icons/Comment';
import SettingsIcon from '@material-ui/icons/Settings';
import CardHeader from '@material-ui/core/CardHeader';
import Badge from '@material-ui/core/Badge';
import { Button, Paper, InputBase, CircularProgress, ButtonBase } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {
	withAuthorization,
	withEmailVerification,
	AuthUserContext,
 } from '../session';
import { Switch, Route, Link } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import { withFirebase } from '../firebase';
import { GridList, GridListTile } from '@material-ui/core';
import { geolocated } from "react-geolocated";
import LocationDisplays from '../location';
import Geocode from "react-geocode";
import * as geolib from 'geolib';
import { doMongoDBGetUserWithAuthEmail } from '../axios';
import axios from 'axios';
import TTY from '../profile/tty.jpg';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#333',
    },
    secondary: {
        main: '#ffeb3b',
    }
},
});

const styles = { 
	paper: {
		rounded: true,
		width: "30vw",
		align: "center",
	},
	input: {
		width: "18vw",
	},
	button: {
		width: "6vw",
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(44, 56, 126, .3)',
      color: 'white',
      rounded: "true",
      variant: "contained",
      textColor: "primary",
	},
	messages: {
    width: "70%",
    position: "center",
    margin: "auto",
  },
  card2: {
    margin: "auto",
  width: "25vh",
  position: "center",
  },
  delete: {
    type: "submit",
    variant: "contained",
    size: "medium",
    background: 'linear-gradient(45deg, #FE6B8B 30%, #bb0a1e 90%)',
    border: '0',
    borderRadius: '3',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    color: 'white',
    rounded: "true",
  },
  edit: {
    type: "submit",
    variant: "contained",
    size: "medium",
    background: 'linear-gradient(50deg, #2c387e 20%, #33eaff 80%)',
    border: '0',
    borderRadius: '3',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    color: 'white',
    rounded: "true",
    textColor: "primary",
  },
}

const useStyles = makeStyles(theme => ({
	card: {
	  minWidth: "320px",
	  maxWidth: "420px",
		height: 460,
		rounded: true,
	},
	media: {
	  height: 0,
	  paddingTop: '56.25%', // 16:9
	},
	expand: {
	  transform: 'rotate(0deg)',
	  marginLeft: 'auto',
	  transition: theme.transitions.create('transform', {
		duration: theme.transitions.duration.shortest,
	  }),
	},
	expandOpen: {
	  transform: 'rotate(180deg)',
	},
	avatar: {
	  backg4roundColor: red[500],
	},
	root: {
		paddingBottom: 5,
		outlineColor: 'black',
		justifyContent: 'center',
	},
	images: {
		maxWidth: 420,
		minWidth: 420,
		// position: "absolute",
		margin: "auto",
	},
	pageMain: {
		minWidth: '720vl',
	  	backgroundColor: 'white',
	},
	pageMedia: {
		height: 0,

		paddingTop: '56.25%',
	},

  }));



const HomeHome = () => (
		<AuthUserContext.Consumer>		
		{authUser => (
			<Images authUser={authUser} />
		)}
			</AuthUserContext.Consumer>
)

const CommentList = ({ messages }) => (
	<ul>
		{messages.map(message => (
			<CommentItem key={message} message={message} />
		))}
	</ul>
)

const CommentItem = ({ message }) => (
	<li>
		<strong>{message.userId}</strong> {message.text}
	</li>
)



const HomePageRoutes = () => {

	return(
			<div align="center">
				<Switch>
					<Route exact path={ROUTES.HOME} component={Home} />
				</Switch>
			</div>
)};





  class ImagesBase extends Component {
	constructor(props){
		super(props);

		this.state = {
			text: '',
			loading: true,
			messages: [],
			images: [],
			swiped: [],
			blocked: [],
			profiles: [],
			am: 3,
		};
	}

	ImageCard = pobj => {
		const prof = pobj.pobj;
		const classes = useStyles();
		//let desc = imageObject.comments[0].text;
		//const otit = imageObject.title;
		const common = prof.mystats.interest.filter(element => this.props.authUser.profile.mystats.interest.includes(element));
		const text = common.toString();
		return (
			<MuiThemeProvider theme={theme}>
			<Card className={classes.card} style={{height: '490px', }}>
		  <CardHeader
			style={{whiteSpace: 'nowrap', fontSize: '1em'}}
			title={prof ? prof.username : "TEST"}
			/>
		  <CardMedia className={classes.media}
			image={prof ? prof.picture ? prof.picture : TTY : TTY }
			title={prof ? prof.username : "TEST"}
			/>
		  <CardContent>
			<Typography variant="body2" color="textSecondary" component="p" style={{wordWrap: 'none',}}>
				{prof ? prof.mystats.bio : "Look at me and my not bio"}
				<br />
				<br />
				{text !== "" ? '~' + text + '~' : "~No Matching Interest~"}
			</Typography>
		  </CardContent>
		  <CardActions disableSpacing style={{display: 'inline-flex', position: 'absolute', bottom: -25, right: '33%'}}>
	
			<IconButton aria-label="Add to favorites" 
				// onClick={() => {
					
					// if (window.confirm('Are you sure you want to delete the picture? you can not have it back.')){
						// 	return delPicture(imageObject, authUser);
						// }
						// }}
						color={ 'primary' }
						>
					<Badge>
				<ThumbUp /> 
						</Badge>
			</IconButton>
			<IconButton aria-label="Share">
			  <ShareIcon />
			</IconButton>
			<IconButton>
			  <CommentIcon />
			  <div style={{padding: `2px`}}>
				  <p>text</p>
			  </div>
			</IconButton>
		  </CardActions>
		</Card>
		</MuiThemeProvider>
		);
	}

	apiSearch = async (config) => {
		let results = "";
		const createSearch = (config) => {
			const profile = this.props.authUser.profile;
			const mystats = profile.mystats;
			const wants = profile.wants;

			let ret;
			if (wants){
				if (wants.prefsex === "Bisexual"){
					ret = "";
				}
				else if (wants.prefsex === "Female"){
					ret = "gender=Female";
				}
				else if (wants.prefsex === "Male"){
					ret = "gender=Male";
				}
				if (config){
					console.log("later");
				}
				return ret;
			}
		}
	
		await axios.get(`http://localhost:3001/search/p_${createSearch(null)}_all`).
		then(async res => {
			let filtered = res.data.filter(obj => obj.__v);

			this.setState({profiles: filtered, loading: false});
			await console.log(filtered);
			
			// res.data.sort((a, b) => {
			// 	if(a.username < b.username) return -1;
			// 	if(a.username > b.username) return 1;
			// 	return 0; 
			// }l
			return filtered;
		}).
		catch(err => {if (err) console.log(err)});
		// await window.alert(results);
		// return `http://localhost:3001/search/p_${query}_all`;
	} 


	ImageList = () => {
		const classes = useStyles();
		let did = 0;
		const flip = () => {
			this.setState({loading: true});
			this.setState({am: am + 3}) ;
			this.setState({loading: false});
		}
		const back = () => {
			this.setState({loading: true});
			this.setState({am: am - 3}) ;
			this.setState({loading: false});
		}
		const {am} = this.state;
		return(
			<div align="center">
				<GridList cols={am} spacing={0} cellHeight={460} classes={{ root: classes.root }}>
						{this.state.profiles.map((pobj, index) => (
							(index < am && index >= am - 3) ? (
								<GridListTile style={{minWidth: `500px`}}  key={index}>
									<div>
										<this.ImageCard pobj={pobj} /* classes={{ root: classes.images }} imageObject={image} authUser={authUser} */ />
									</div>
								</GridListTile>)
							: index === (am + 1) || (am === this.state.profiles.length && did++ < 1) || am > this.state.profiles.length && did++ < 1 ? <div>
								{am > 0 && <ButtonBase onClick={() => back()}>Back</ButtonBase> } { am + 1 < this.state.profiles.length && <ButtonBase onClick={() => flip()}>Next</ButtonBase>}
							</div>
							: null
						))}
				</GridList>
			</div>
		);
	}

	componentDidMount() {
		this.setState({ loading: true  });
		doMongoDBGetUserWithAuthEmail(this.props.authUser).then(res => {
			let me = res;
			this.setState({swiped: me.swiped, blocked: this.props.authUser.profile.blocked});
			console.log(me);
		}).then(() => { this.apiSearch() })
		.catch(err => {if (err) return err});
	}

	componentWillUnmount() {
    console.log('UNMOUNTED COMBAT');
  }

	render() {
		const {images, loading } = this.state;

		return(
			<MuiThemeProvider theme={theme}>
					<div align="center">
						{loading ? 
						<p>Loading</p>
						:
						<this.ImageList /* images={images} authUser={authUser} firebase={this.props.firebase} *//>
					}
					</div>
			</MuiThemeProvider>
		);
	}

}

 class MessagesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: false,
      messages: [],
      limit: 5,
    };
  }

  componentDidMount() {
    // this.onListenForMessages();
  }

//   onListenForMessages = () => {
//     this.setState({ loading: true });

//     this.props.firebase
//       .messages()
//       .orderByChild('createdAt')
//       .limitToLast(this.state.limit)
//       .on('value', snapshot => {
//         const messageObject = snapshot.val();

//         if (messageObject) {
//           const messageList = Object.keys(messageObject).map(key => ({
//             ...messageObject[key],
//             uid: key,
//           }));

//           this.setState({
//             messages: messageList,
//             loading: false,
//           });
//         } else {
//           this.setState({ messages: null, loading: false });
//         }
//       });
//   };

  componentWillUnmount() {
    // this.props.firebase.messages().off();
  }

  onChangeText = event => {
    // this.setState({ text: event.target.value });
  };

//   onCreateMessage = (event, authUser) => {
//     this.props.firebase.messages().push({
//       text: this.state.text,
//       userId: authUser.uid,
//       createdAt: this.props.firebase.serverValue.TIMESTAMP,
//     });

    // this.setState({ text: '' });

    // event.preventDefault();
//   };

//   onEditMessage = (message, text) => {
//     this.props.firebase.message(message.uid).set({
//       ...message,
//       text,
//       editedAt: this.props.firebase.serverValue.TIMESTAMP,
//     });
//   };

//   onRemoveMessage = uid => {
//     this.props.firebase.message(uid).remove();
//   };

//   onNextPage = () => {
//     this.setState(
//       state => ({ limit: state.limit + 5 }),
//       this.onListenForMessages,
//     );
//   };

  render() {
    const { users } = this.props;
    const { text, messages, loading } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {!loading && messages && (
              <Button style={styles.button} onClick={this.onNextPage}>
                More
              </Button>
            )}

            {loading && <div><CircularProgress color="secondary"/></div>}

            <div style={styles.messages}>
            <Card
        display="flex"
        rounded="true"
        
        >
        <CardContent>
            {messages && (
              <MessageList
                messages={messages.map(message => ({
                  ...message,
                  user: users 
                    ? users[message.userId]
                    : { userId: message.userId },
                }))}
                onEditMessage={this.onEditMessage}
                onRemoveMessage={this.onRemoveMessage}
              />
            )}
            {!messages && <div>There are no messages ...</div>}
            </CardContent>
        </Card>
        </div>
        <br/>
              <div align="center">
              <Paper style={styles.paper}>   
               <InputBase
               placeholder="type a message"
                type="text"
                value={text}
                onChange={this.onChangeText}>
                </InputBase>
                <Button onClick={event =>this.onCreateMessage(event, authUser)} style={styles.button}>Send</Button>
            </Paper>
            </div>
            <br/>
          </div>
          
        )}
      </AuthUserContext.Consumer>
      </MuiThemeProvider>
    );
  }
}

 const MessageList = ({
  messages,
  onEditMessage,
  onRemoveMessage,
}) => (
  <ul style={{ listStyleType: "none" }}>
    {messages.map(message => (
      <MessageItem
        key={message.uid}
        message={message}
        onEditMessage={onEditMessage}
        onRemoveMessage={onRemoveMessage}
      />
    ))}
  </ul>
);

class MessageItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.message.text,
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.message.text,
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditMessage(this.props.message, this.state.editText);

    this.setState({ editMode: false });
  };

  render() {
    const { message, onRemoveMessage } = this.props;
    const { editMode, editText } = this.state;

    return (
      <li>
        {editMode ? (
          <Paper>
          <InputBase
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
          />
          </Paper>
        ) : (
          <span>
            <strong style={{ color: 'hotPink' }}>
              {message.user.username || message.user.userId}
            </strong>{' '}
            {message.text} {message.editedAt && <span>(Edited)</span>}
          </span>
        )}

        {editMode ? (
          <span>
            <Button style={styles.Button} onClick={this.onSaveEditText}>Save</Button>
            <Button style={styles.Button} onClick={this.onToggleEditMode}>Reset</Button>
          </span>
        ) : (
          <Button style={styles.edit} onClick={this.onToggleEditMode}><EditIcon/></Button>
        )}

        {!editMode && (
          <Button style={styles.delete}
            onClick={() => onRemoveMessage(message.uid)}
          >
            <DeleteIcon/>
          </Button>
        )}
      </li>
    );
  }
}
class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
	  users: null,
	  isLocationEnabled: true,
    };
  }

  async componentDidMount() {
    this.props.firebase.users().on('value', snapshot => {
      this.setState({
        users: snapshot.val(),
      });
	});
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  
  render() {
	  const mycooords = {latitude: "37.7790262", longitude: "-122.4199061"}
	  const newcoords = {latitude: "37.5503916", longitude: "-122.049641"}
	  const TXRoadhouse = {latitude: "37.594970", longitude: "122.063890"}
	  const popeyes = {latitude: "37.590380", longitude: "-122.070230"}
	  const myHouse = {latitude: "33.210330", longitude: "-96.739310"}
	  const distance = geolib.getDistance(newcoords, mycooords);
	return !this.props.isGeolocationAvailable ? (
		<div>Your browser does not support Geolocation</div>
	) : !this.props.isGeolocationEnabled ? (
		<div>Geolocation is not enabled</div>
	) : this.props.coords ? (
		<div align="center">
		<HomePageRoutes />
		{LocationDisplays(this.props.coords.latitude, this.props.coords.longitude)}
		{console.log('FIND_NEAREST', geolib.findNearest(newcoords, [myHouse, TXRoadhouse, popeyes, mycooords]))}
		{console.log('IS ' +  geolib.convertDistance(distance, 'mi'), 'away')}
      </div>
	) : (
		<div>Getting the location data&hellip; </div>
	);
  }
}


const Messages = withFirebase(MessagesBase);
const Home = withFirebase(HomeHome);
const Images = withFirebase(ImagesBase);

const condition = authUser => !!authUser;

export default compose(
	withEmailVerification,
	withAuthorization(condition),
	geolocated({
		positionOptions: {
			enableHighAccuracy: false,
		},
		userDecisionTimeout: 5000})
)(HomePage);