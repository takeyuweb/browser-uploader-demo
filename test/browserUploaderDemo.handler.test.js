var expect = require('chai').expect;
var sinon = require('sinon');
var aws = require('aws-sdk');
var proxyquire = require('proxyquire');

var data = {
    "Records": [
        {
            "eventVersion": "2.0",
            "eventSource": "aws:s3",
            "awsRegion": "us-east-1",
            "eventTime": "1970-01-01T00:00:00.000Z",
            "eventName": "ObjectCreated:Put",
            "userIdentity": {
                "principalId": "EXAMPLE"
            },
            "requestParameters": {
                "sourceIPAddress": "127.0.0.1"
            },
            "responseElements": {
                "x-amz-request-id": "C3D13FE58DE4C810",
                "x-amz-id-2": "FMyUVURIY8/IgAtTv8xRjskZQpcIZ9KG4V5Wp6S7S/JRWeUWerMUE5JgHvANOjpD"
            },
            "s3": {
                "s3SchemaVersion": "1.0",
                "configurationId": "testConfigRule",
                "bucket": {
                    "name": "sourcebucket",
                    "ownerIdentity": {
                        "principalId": "EXAMPLE"
                    },
                    "arn": "arn:aws:s3:::mybucket"
                },
                "object": {
                    "key": "HappyFace.jpg",
                    "size": 1024,
                    "eTag": "d41d8cd98f00b204e9800998ecf8427e"
                }
            }
        }
    ]
};
var context = {
    invokeid: 'invokeid',
    done: function(err, message){
        return;
    },
    fail: function(err, message){
        return;
    }
};

describe('s32DynamoDB', function(){
    var s32DynamoDB;
    var headObject, putItem;
    var fakeS3Object;
    before(function(){
        s3Object = {
            "ContentLength": 1024,
            "ContentType": "image/jpeg"
        };
        headObject = sinon.stub().yields(null, s3Object);
        putItem = sinon.stub().yields(1, null);
        s32DynamoDB = getTestedModule(headObject, putItem);
    });
    it('call S3 headObject', function(){
        s32DynamoDB.handler(data, context);
        expect(headObject).has.been.calledOnce;
    });
    it('call DynamoDB putItem', function(){
        s32DynamoDB.handler(data, context);
        expect(putItem).has.been.calledOnce;
    });
    it('call context.done', function(){
        context.done = sinon.stub();
        s32DynamoDB.handler(data, context);
        expect(context.done).has.been.calledOnce;
    });
});

function getTestedModule(headObject, putItem) {
    return proxyquire('../browserUploaderDemo.js', {
        'aws-sdk': {
            'S3': function(){
                return {
                    headObject: headObject
                };
            },
            'DynamoDB': function(){
                return {
                    putItem: putItem
                };
            }
        }
    });
}
