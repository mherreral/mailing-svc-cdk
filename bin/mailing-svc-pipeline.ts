#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MailingSvcPipelineStack } from '../lib/mailing-svc-pipeline-stack';

const app = new cdk.App();
new MailingSvcPipelineStack(app, 'MyPipelineStack', {});