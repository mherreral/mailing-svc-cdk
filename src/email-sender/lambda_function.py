import boto3
import json
from botocore.exceptions import ClientError

def send_email(event):
    AWS_REGION = "us-east-1"
    # Create a new SES resource and specify a region.
    ses = boto3.client('ses',region_name=AWS_REGION)
    s3 = boto3.client('s3',region_name=AWS_REGION)
    bucket = event['detail']['bucket']['name']
    key = event['detail']['object']['key']
    response = s3.get_object(Bucket=bucket, Key=key)
    data = response['Body'].read().decode('utf-8')
    parsed_data = json.loads(data)

    for item in parsed_data["messages"]:

        SENDER = "manuela@loka.com" # must be verified in AWS SES Email
        RECIPIENT = item["email"] # must be verified in AWS SES Email
        message = item["message"]
        # The subject line for the email.
        SUBJECT = "This is test email for testing purpose..!!"
        # The character encoding for the email.
        CHARSET = "UTF-8"

        # Try to send the email.
        try:
            #Provide the contents of the email.
            response = client.send_email(
                Destination={
                    'ToAddresses': [
                        RECIPIENT,
                    ],
                },
                Message={
                    'Body': {
                        'Text': {
            
                            'Data': message
                        },
                    },
                    'Subject': {

                        'Data': SUBJECT
                    },
                },
                Source=SENDER
            )
        # Display an error if something goes wrong.	
        except ClientError as e:
            print(e.response['Error']['Message'])
        else:
            print("Email sent! Message ID:"),
            print(response['MessageId'])

def lambda_handler(event, context):
    print(event)
    send_email(event)