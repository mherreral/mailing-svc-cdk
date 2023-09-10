import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from "constructs";
import { LambdaStack } from './lambda-stack';

interface lambdaStackProps extends cdk.StackProps {
    bucket: s3.Bucket
}

export class infraStage extends cdk.Stage {
    constructor(scope: Construct, stageName: string, props: lambdaStackProps){
        super(scope, stageName, props);

        const lambdaStack = new LambdaStack(this, 'LambdaStack', stageName, props);
    }
};