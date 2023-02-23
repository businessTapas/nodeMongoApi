const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;
const fs = require('fs');

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate(userParam) {
    const user = await User.findOne({  username: userParam.username });
    if (user && bcrypt.compareSync( userParam.password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '1d' });
        return {
            ...user.toJSON(),
            token
        };
    }else{
        throw "Username or password is incorrect";
    }
}

async function getAll() {
    return await User.find().populate({path:"departmentId", select:["departmentname"]});
}

async function getById(id) {
    return await User.findById(id);
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
   // console.log(userParam);
   var unlinkFlag = 1;  
   const user = await User.findById(id);
    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }
    if ( userParam.imagefile != '' && user.imagefile != '' ) {  
        if (fs.existsSync(user.imagefile)) {
            console.log('file exists');
          } else {
            unlinkFlag = 0;
            console.log('file not found!');
          }
         
        if (unlinkFlag == 1) {
            console.log('unlinkFlag:  '+unlinkFlag);
            await fs.unlink(user.imagefile, (err) => {
                if (err) {
                    throw err;
                }
            
                console.log("Delete Previous File successfully.");
            });
        }
        
    }

    if ( userParam.imagefile == '' &&  user.imagefile != '') {    
        userParam.imagefile = user.imagefile;
    }
        // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function chkFileExist(imageurl) {
    await fs.access(imageurl, (err) => {
        if (err)
        throw err;
    });
} 