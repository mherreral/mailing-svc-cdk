#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaStack } from '../lib/lambda-stack';
import { BucketStack } from '../lib/s3-bucket-stack';

const app = new cdk.App();

const bucketStack = new BucketStack(app, 'BucketStack', {})
new LambdaStack(app, 'LambdaStack', {bucket: bucketStack.bucket})