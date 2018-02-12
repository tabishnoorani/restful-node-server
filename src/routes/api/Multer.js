import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
// import UUID from 'node-uuid';
import config from '../../config';

cloudinary.config({...config.Cloudinary})

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'imrego',
    allowedFormats: ['jpg', 'png'],
    filename: function (req, file, cb) {
      cb(undefined, req.uuid);
    }
  });

const fileFilter =  (req, file, cb)=>{
    if (file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null, true)
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*4 // 4 megabytes,
    },
    fileFilter: fileFilter
});

export default upload;