console.log('Loading function');

var config =require('config');
var aws = require('aws-sdk');
var s3 = new aws.S3({apiVersion: '2006-03-01'});
var dynamo = new aws.DynamoDB({region: config.dynamodb.region});

exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    var bucket = event.Records[0].s3.bucket.name;
    var key = decodeURI(event.Records[0].s3.object.key);

    var regexp = /^upload\/.+/;
    var match = regexp.exec(key);
    if (match === null) {
        context.done(null, 'except upload');
        return;
    }

    var params = {
        Bucket: bucket,
        Key: key
    };
    console.log(s3.headObject);
    s3.headObject(params, function(err, data) {
        if (err) {
            console.log(err);
            var message = "Error getting object " + key + " from bucket " + bucket +
                ". Make sure they exist and your bucket is in the same region as this function.";
            console.log(message);
            context.fail(message);
        } else {
            // console.log('CONTENT TYPE:', data.ContentType);
            dynamo.putItem({
                "TableName": config.dynamodb.table,
                "Item": {
                    "Key": {"S": key},
                    "ContentLength": {"N": data.ContentLength},
                    "ContentType": {"S": data.ContentType},
                    "CreatedAt": {"S": event.Records[0].eventTime}
                }
            }, function(err, data) {
                if (err) {
                    console.log(err);
                    context.fail(err);
                } else  {
                    console.log("data uploaded successfully," + data);
                    context.done();
                }
            });
        }
    });
};
