import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { LambdaStack } from '../lib/lambda-stack';
import { BucketStack } from '../lib/s3-bucket-stack';

import { Construct } from 'constructs';
import { pipelines, Stack, StackProps, Stage, StageProps } from "aws-cdk-lib";
import { InfraStage } from './infra-stage';

interface lambdaStackProps extends cdk.StackProps {
  bucket: s3.Bucket
}

export class MailingSvcPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: lambdaStackProps) {
    super(scope, id, props);


    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      pipelineName: 'MailingSvcPipeline',
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub('mherreral/mailing-svc-cdk', 'master', {
            authentication: cdk.SecretValue.secretsManager('gh-at')
        }),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

    const infra = pipeline.addStage(
      new InfraStage(this, "testing", props), {
        pre: [new pipelines.ManualApprovalStep('Deploy infra')]
      }
      );
  }
}