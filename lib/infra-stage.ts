import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from "constructs";
import { LambdaStack } from './lambda-stack';
import { BucketStack } from './s3-bucket-stack';

export class InfraStage extends cdk.Stage {
    constructor(scope: Construct, stageName: string, props?: cdk.StageProps){
        super(scope, stageName, props);

        const bucketStack = new BucketStack(this, 'BucketStack');
        const lambdaStack = new LambdaStack(this, 'LambdaStack', {bucket: bucketStack.bucket});
    }
};