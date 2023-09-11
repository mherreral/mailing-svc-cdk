import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { pipelines, Stack, StackProps, Stage, StageProps } from "aws-cdk-lib";
import { InfraStage } from './infra-stage';

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

    const infra = pipeline.addStage(
      new InfraStage(this, "testing"), {
        pre: [new pipelines.ManualApprovalStep('Deploy infra')]
      }
      );
  }
}