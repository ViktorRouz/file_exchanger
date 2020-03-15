const encryptor = require('./file-encryptor');
const File = require('../models/file');
const User = require('../models/user');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storeFiles = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads/files');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname)
    }
});

const uploadFile = multer({storage: storeFiles}).single('file');

const sendJSONResponse = (res, content) => {
    res.json(content);
};

exports.getFilesAuthor = (req, res, next) => {

    File
        .find({creatorId: req.params.id})
        .then(files => sendJSONResponse(res, {
            success: true,
            files: files,
        }))
        .catch(err => sendJSONResponse(res, {
            success: false,
            err: err
        }));
};

exports.getFile = async (req, res, next) => {
    try {
        const {id, password} = req.body;

        const file = await File.findById(id);

        const filename = file.nameEncrypted;
        const sourceExtension = file.sourceExtension;
        let numberOfDownloads = file.numberOfDownloads + 1;

        await File.findByIdAndUpdate(id, {numberOfDownloads});

        const filepath = path.join(__dirname, '../public/uploads/files/' + `${filename}.dat`);
        const temporaryStorage = path.join(__dirname, '../public/uploads/temporary-storage/'
            + `${filename}.${sourceExtension}`);

        const options = {algorithm: 'aes256'};

        encryptor.decryptFile(filepath, temporaryStorage, password, options, (err) => {
            if (err) {
                sendJSONResponse(res, {
                    success: false,
                    err: err
                })
            } else {
                res.sendFile(temporaryStorage, null, (err) => {
                    if (fs.existsSync(temporaryStorage)) {
                        fs.unlinkSync(temporaryStorage);
                    }
                });
            }
        });

    } catch (error) {
        sendJSONResponse(res, {
            success: false,
            err: error
        })
    }
};

exports.getDataFile = async (req, res, next) => {
    try {
        const {idFile} = req.query;

        const files = await File.find({_id: idFile});

        if (files && files.length){
            sendJSONResponse(res, {
                success: true,
                file: files[0],
            })
        } else {
            sendJSONResponse(res, {
                success: false,
                file: files[0],
            })
        }

    } catch (error) {
        sendJSONResponse(res, {
            success: false,
            err: error
        })
    }
};

exports.createFile = (req, res, next) => {
    try {
        uploadFile(req, res, (err) => {

            console.log(err);

            if (err) {
                return sendJSONResponse(res, {
                    success: false,
                    err: err
                });
            }

            const {nameForAuthor, password, creatorId} = req.body;
            const options = {algorithm: 'aes256'};

            const nameEncrypted = `${(req.file.filename.split('.')[0]).split('-')[0]}`;
            const sourceExtension = req.file.filename.split('.')[1];

            const filepath = path.join(__dirname, '../public/uploads/files/') + req.file.filename;
            const filepathEncoded = path.join(__dirname, '../public/uploads/files/') + `${nameEncrypted}.dat`;

            encryptor.encryptFile(filepath, filepathEncoded, password, options, async (err) => {
                if (err) {
                    return sendJSONResponse(res, {
                        success: false,
                        err: err
                    });
                } else {
                    const user = await User.findById(creatorId);

                    const fileData = {
                        nameEncrypted,
                        nameForAuthor,
                        sourceExtension,
                        creator: user.name,
                        creatorId,
                        numberOfDownloads: 0,
                        dateCreation: new Date().toISOString()
                    };

                    const file = await File.create(fileData);

                    fs.unlinkSync(filepath);

                    sendJSONResponse(res, {
                        success: true,
                        file,
                    });
                }
            });
        });
    } catch (error) {
        sendJSONResponse(res, {
            success: false,
            err: error
        })
    }
};

exports.deleteFile = async (req, res, next) => {
    try {
        const file = await File.findById(req.params.id);

        const filepath = path.join(__dirname, '../public/uploads/files/') + `${file.nameEncrypted}.dat`;
        fs.unlinkSync(filepath);

        await File.findById(req.params.id).deleteOne();

        sendJSONResponse(res, {
            success: true
        });

    } catch (error) {
        sendJSONResponse(res, {
            success: false,
            err: err
        })
    }
};
