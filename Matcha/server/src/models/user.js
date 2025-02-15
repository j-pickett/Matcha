import mongoose from 'mongoose';


// ORIGINAL SCHEMA before implementation
// const OLDuserSchema = new mongoose.Schema({
// 	username: {
// 		type: String,
// 		unique: true,
// 	},
// });


// so the stuff isnt as messy
const minMax = {
	min: Number,
	max: Number,
};

// current using Schema for creating the new user. 
// WITHOUT ADMIN | AUTH | EMAIL VERIFY 
const userSchema = new mongoose.Schema({
	fireid: String,
	username: String,
	email: String,
	location: {lon: Number, lat: Number},
	access: {
		level: Number,
		group: String,
	},
	swiped: [{username: String, liked: Boolean}]
})

// IDK how this works but im sure it works somehow... was added
// from the 5 part set from https://www.robinwieruch.de/
userSchema.statics.findByLoginEmailUid = async function (login) {
	let user = await this.findOne({
		username: login,
	});
	if (!user) {
		user = await this.findOne({fireid: login });
	}

	if (!user) {
		user = await this.findOne({ email: login });
	}

	return user;
};


// something for on remove. not sure. again from the website thing.
userSchema.pre('remove', (next) => {
	this.model('Message').deleteMany({ user: this._id }, next);
	this.model('Gallery').deleteMany({ username: this.username }, next);
});

const User = mongoose.model('User', userSchema);

export default User;