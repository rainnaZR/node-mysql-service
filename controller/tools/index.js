const multiparty = require('multiparty');
const sizeOf = require('image-size');
const imgUtils = require('../../utils/imgUtils');
const {success, failed} = require('../common');
const OSS = require('ali-oss');

// 上传接口
const upload = async(ctx, next) => {
    const _uploadFile = function(){
        return new Promise((resolve, reject) => {
            const form = new multiparty.Form({
                encoding: 'utf-8',
                keepExtensions: true  //保留后缀
            });
            form.parse(ctx.req, async function(err, fields, files) {
                if (err) {
                    throw err;
                    return;
                };

                let successData = [];
                let errorData = [];
                let { extensions, maxSize, width, height, rootDirectory, fileDirectory, bucket = 'image-' } = fields;

                // 设置bucket
                imgUtils.OSS_CONFIG.bucket = bucket;
                // 实例化ossClient
                let ossClient = new OSS(imgUtils.OSS_CONFIG);

                for(let i=0; i<files.file.length; i++){
                    let file = files.file[i];
                    if(!file) continue;

                    let fileName = file.originalFilename;
                    const { width: imgWidth, height: imgHeight } = sizeOf(file.path);

                    // 校验图片的后缀名
                    if(!imgUtils.checkExtensions(file, extensions)){
                        errorData.push({
                            name: 'ExtensionError',
                            message: `只能上传${extensions}类型的文件！`,
                            data: {
                                fileName,
                                extensions: extensions[0]
                            }
                        });
                        continue;
                    };

                    // 检查文件的尺寸
                    if(!imgUtils.checkSize(file, maxSize)){
                        errorData.push({
                            name: 'SizeError',
                            message: '文件大小超出限制！',
                            data: {
                                fileName,
                                maxSize: maxSize[0],
                                fileSize: file.size
                            }
                        });
                        continue;
                    };

                    // 检查文件的尺寸
                    let res = imgUtils.checkDimension(imgWidth, imgHeight, width, height);
                    if(!res.success){
                        res.data.fileName = fileName;
                        errorData.push(res);
                        continue;
                    };

                    // 生成文件名
                    let newFileName = imgUtils.hashFileName(fileName);
                    // 生成文件路径
                    let directory = imgUtils.getDirectory(rootDirectory, fileDirectory);

                    // oss文件上传
                    await ossClient.put(`${directory}${newFileName}`, file.path).then(res => {
                        if(res && res.name){
                            let url = `${imgUtils.IMAGE_DOMAIN[bucket]}/${res.name}`;
                            successData.push({
                                url,
                                width: imgWidth,
                                height: imgHeight,
                                size: file.size
                            });
                        }
                    }).catch(err => {
                        errorData.push(err);
                    });
                }
                ctx.response.type = 'json';
                ctx.response.body = success({
                    error: errorData,
                    success: successData
                });
                resolve(next());
            });
        });
    };

    await _uploadFile();
};

// 上传blob二进制数据
const uploadBlob = async(ctx, next) => {
    const _upload = function(){
        return new Promise((resolve, reject) => {
            const form = new multiparty.Form({
                encoding: 'utf-8',
                keepExtensions: true  //保留后缀
            });
            form.parse(ctx.req, async function(err, fields, files) {
                if (err) {
                    throw err;
                    return;
                };

                let { bucket = 'image-xxx', fileName } = fields;
                // 设置bucket
                imgUtils.OSS_CONFIG.bucket = bucket;
                // 实例化ossClient
                let ossClient = new OSS(imgUtils.OSS_CONFIG);
                let response;

                for(let i=0; i<files.file.length; i++){
                    let file = files.file[i];
                    if(!file) continue;

                    // oss文件上传
                    await ossClient.put(fileName[0], file.path).then(res => {
                        if(res && res.name){
                            let url = `${imgUtils.IMAGE_DOMAIN[bucket]}/${res.name}`;
                            response = {
                                url
                            };
                        }
                    }).catch(err => {
                        reject(err);
                    });

                    ctx.response.type = 'json';
                    ctx.response.body = success(response);
                    resolve(next());
                }
            });
        });
    };

    await _upload();
};

module.exports = {
    upload,
    uploadBlob
};
