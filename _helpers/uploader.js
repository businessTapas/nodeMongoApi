const multer = require('multer')
const util = require("util");

const storageEngine = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './public/uploads/')
	},
	filename: function(req, file, cb){
		//let ext = path.extname(file.originalname)
		cb(null, Date.now() + file.originalname);
	}
})

const upload = multer({
	storage: storageEngine,
	fileFilter: function(req, file, callback){
		//console.log(file);
		if(
			file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png"
		){
			callback(null, true)
		} else{
			console.log("Error in uploading")
			callback(null, false)
		}
	},
	limits: {
		fileSize: 1024 * 1024 * 5
	}
}).single("imagefile");

let uploadFileMiddleware = util.promisify(upload);
module.exports = uploadFileMiddleware;
