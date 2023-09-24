import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS);

// TODO: Implement the FileStorage logic
export class FileStorage {
    constructor(
        private s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private bucket = process.env.AWS_BUCKET
    ) {}

    getUploadUrl() {
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucket,
            // Key: todoId,
            // Expires: parseInt(urlExpiration)
        });
    }
}
