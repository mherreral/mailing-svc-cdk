import * as cdk from 'aws-cdk-lib';
import { LambdaStack } from '../lib/lambda-stack';
import { BucketStack } from '../lib/s3-bucket-stack';

import { Construct } from 'constructs';
import { pipelines, Stack, StackProps, Stage, StageProps } from "aws-cdk-lib";
import { infraStage } from './infra-stage';

export class MailingSvcPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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

    const deployLambdaStage = new cdk.Stage(this, 'DeployLambda');
    pipeline.addStage(deployLambdaStage);

    deployLambdaStage.addAction(new codepipeline_actions.CloudFormationCreateUpdateStackAction({
        actionName: 'DeployLambdaStack',
        templatePath: cloudAssemblyArtifact.atPath('LambdaStack.template.json'),
        stackName: 'LambdaStack',
        adminPermissions: true,
      }));
  }
}