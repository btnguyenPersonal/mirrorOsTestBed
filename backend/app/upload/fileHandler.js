const multer = require('multer');

exports.uploader = (req, res, next) => {
	var id = req.params.id;
	
	//storage details - path and file name
	var storage = multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, './app/upload/files/' + id + '/');
		},
		filename: function(req, file, cb) {
			cb(null, file.originalname);
		}
	});
	
	//filters out wrong file types
	const fileFilter = (req, file, cb) => {
		if(file.mimetype === 'application/octet-stream')
			cb(null, true);
		else
			cb(new Error, false);
	};
	
	var upload = multer({
		storage: storage, 
		limits: {
			fileSize: 30 * 1024 * 1024
			},
		fileFilter: fileFilter
	}).single('imgFile');
	
	upload (req, res, (err) => {
		if(!err)
			next();
		else if (err.code === 'LIMIT_FILE_SIZE')
			return res.status(400).send({ message: 'File size too large' });
		else if(err instanceof multer.MulterError)
			return res.status(500).send({ message: 'File upload error' });
		else
			return res.status(400).send({ message: 'Unsupported file type' });
	});
};