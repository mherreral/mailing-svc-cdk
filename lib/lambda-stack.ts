import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as aws_events from 'aws-cdk-lib/aws-events';
import * as aws_events_targets from 'aws-cdk-lib/aws-events-targets';

import { Construct } from 'constructs';
interface lambdaStackProps extends cdk.StackProps {
    bucket: s3.Bucket
}  

import path = require('path');


export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: lambdaStackProps) {
    super(scope, id, props);

    const fcn_params = {
        runtime: lambda.Runtime.PYTHON_3_10,
        handler: 'lambda_function.lambda_handler',
        code: lambda.Code.fromAsset(path.join(__dirname, '../src/email-sender')),
    }
    const fcn = new lambda.Function(this, 'email-sender', fcn_params);

    const eventRule = new aws_events.Rule(this, "triggerFcn", {
        ruleName: "emailfile-obj-created",
        eventPattern: {
            source: ["aws.s3"],
            detailType: aws_events.Match.equalsIgnoreCase("object created"),
            detail: {
                bucket: {
                    name: [props.bucket.bucketName]
                },
            },
        },
        targets: [new aws_events_targets.LambdaFunction(fcn)],
    });
    aws_events_targets.addLambdaPermission(eventRule, fcn);

    props.bucket.grantRead(fcn)
    fcn.addToRolePolicy(new iam.PolicyStatement({
        actions: ['ses:SendEmail', 'SES:SendRawEmail'],
        resources: ['*'],
        effect: iam.Effect.ALLOW,
    }))
  }
}
