import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';

export class MailingSvcPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MailingSvcPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('mherreral/mailing-svc-cdk', 'master'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });
  }
}