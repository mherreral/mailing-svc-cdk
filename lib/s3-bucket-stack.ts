import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class BucketStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //The code that defines your stack goes here
    this.bucket =  new s3.Bucket(this, 'email-files-bucket', {
      bucketName: 'email-files-bucket-loka-qwe8',
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.DESTROY,
      eventBridgeEnabled: true,
      autoDeleteObjects: true
    });
 }
}
