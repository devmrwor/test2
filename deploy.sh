#!/bin/bash

set -e # Stop script on first error

AWS_INSTANCE_ID=$1
AWS_REGION=$2
DOCKER_IMAGE_NAME=$3
DOCKER_CMS_IMAGE_TAG=$6
DOCKER_CLIENT_IMAGE_TAG=$7
DOCKER_CMS_IMAGE_NAME="$3:$6"
DOCKER_CLIENT_IMAGE_NAME="$3:$7"
DOCKER_CMS_SERVICE_NAME="$4_cms"
DOCKER_CLIENT_SERVICE_NAME="$4_web"
DOCKER_EC_REPOSITORY=$5

STATUS="Pending"

function check_status() {
    local command_id=$1
    local attempts=0
    local MAX_ATTEMPTS=25

    while [[ "$STATUS" == "Pending" || "$STATUS" == "InProgress" ]]; do
        if [ $attempts -eq $MAX_ATTEMPTS ]; then
        echo "Command did not complete within the expected time."
        exit 1
        fi

        STATUS=$(aws ssm get-command-invocation --command-id $command_id --instance-id $AWS_INSTANCE_ID --query "Status" --output text)
        
        echo "Command status: $STATUS"

        if [[ "$STATUS" == "Pending" || "$STATUS" == "InProgress" ]]; then
        sleep 5
        attempts=$((attempts+1))
        fi
    done
}

## Get current stack version
COMMAND_ID=$(aws ssm send-command --document-name "AWS-RunShellScript" --document-version "1" --targets '[{"Key":"InstanceIds","Values":["'"$AWS_INSTANCE_ID"'"]}]' --parameters '{"workingDirectory":[""],"executionTimeout":["3600"],"commands":["docker service inspect --format '"'"'{{ (index .ID) }}'"'"' '"$DOCKER_CMS_SERVICE_NAME"'"]}' --timeout-seconds 600 --max-concurrency "50" --max-errors "0" --region "$AWS_REGION" --query "Command.CommandId" --output text)

STATUS="Pending"
check_status $COMMAND_ID

if [ "$STATUS" == "Success" ]; then
    CURRENT_VERSION=$(aws ssm get-command-invocation --command-id $COMMAND_ID --instance-id $AWS_INSTANCE_ID --query "StandardOutputContent" --output text)
else
    CURRENT_VERSION=0
fi

echo "Current version is -$CURRENT_VERSION-"

## Pull latests CMS image
COMMAND_ID=$(aws ssm send-command --document-name "AWS-RunShellScript" --document-version "1" --targets '[{"Key":"InstanceIds","Values":["'"$AWS_INSTANCE_ID"'"]}]' --parameters '{"commands":["aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin '"$DOCKER_EC_REPOSITORY"' && docker pull '"$DOCKER_CMS_IMAGE_NAME"'"],"workingDirectory":[""],"executionTimeout":["3600"]}' --timeout-seconds 600 --max-concurrency "50" --max-errors "0" --region "$AWS_REGION" --query "Command.CommandId" --output text)

STATUS="Pending"
check_status $COMMAND_ID

## Verify it's updated
if [ "$STATUS" != "Success" ]; then
    echo "Stack deployment failed"
    exit 1
fi

## Pull latests client image
COMMAND_ID=$(aws ssm send-command --document-name "AWS-RunShellScript" --document-version "1" --targets '[{"Key":"InstanceIds","Values":["'"$AWS_INSTANCE_ID"'"]}]' --parameters '{"commands":["aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin '"$DOCKER_EC_REPOSITORY"' && docker pull '"$DOCKER_CLIENT_IMAGE_NAME"'"],"workingDirectory":[""],"executionTimeout":["3600"]}' --timeout-seconds 600 --max-concurrency "50" --max-errors "0" --region "$AWS_REGION" --query "Command.CommandId" --output text)

STATUS="Pending"
check_status $COMMAND_ID

## Verify it's updated
if [ "$STATUS" != "Success" ]; then
    echo "Stack deployment failed"
    exit 1
fi

## Upgrade CMS stack
COMMAND_ID=$(aws ssm send-command --document-name "AWS-RunShellScript" --document-version "1" --targets '[{"Key":"InstanceIds","Values":["'"$AWS_INSTANCE_ID"'"]}]' --parameters '{"commands":["docker service update '"$DOCKER_CMS_SERVICE_NAME"' --with-registry-auth --image '"$DOCKER_CMS_IMAGE_NAME"'"],"workingDirectory":["/home/ec2-user/app"],"executionTimeout":["3600"]}' --timeout-seconds 600 --max-concurrency "50" --max-errors "0" --region "$AWS_REGION" --query "Command.CommandId" --output text)

STATUS="Pending"
check_status $COMMAND_ID

## Verify it's running
if [ "$STATUS" != "Success" ]; then
    echo "Stack deployment failed"
    exit 1
fi

## Upgrade client stack
COMMAND_ID=$(aws ssm send-command --document-name "AWS-RunShellScript" --document-version "1" --targets '[{"Key":"InstanceIds","Values":["'"$AWS_INSTANCE_ID"'"]}]' --parameters '{"commands":["docker service update '"$DOCKER_CLIENT_SERVICE_NAME"' --with-registry-auth --image '"$DOCKER_CLIENT_IMAGE_NAME"'"],"workingDirectory":["/home/ec2-user/app"],"executionTimeout":["3600"]}' --timeout-seconds 600 --max-concurrency "50" --max-errors "0" --region "$AWS_REGION" --query "Command.CommandId" --output text)

STATUS="Pending"
check_status $COMMAND_ID

## Verify it's running
if [ "$STATUS" != "Success" ]; then
    echo "Stack deployment failed"
    exit 1
fi

## Compare versions to prevent rollbacks
COMMAND_ID=$(aws ssm send-command --document-name "AWS-RunShellScript" --document-version "1" --targets '[{"Key":"InstanceIds","Values":["'"$AWS_INSTANCE_ID"'"]}]' --parameters '{"commands":["docker service inspect --format '"'"'{{ (index .ID) }}'"'"' '"$DOCKER_CMS_SERVICE_NAME"'"],"workingDirectory":[""],"executionTimeout":["3600"]}' --timeout-seconds 600 --max-concurrency "50" --max-errors "0" --region "$AWS_REGION" --query "Command.CommandId" --output text)

STATUS="Pending"
check_status $COMMAND_ID

if [ "$STATUS" == "Success" ]; then
    NEW_VERSION=$(aws ssm get-command-invocation --command-id $COMMAND_ID --instance-id $AWS_INSTANCE_ID --query "StandardOutputContent" --output text)
else
    echo "Stack deployment failed"
    exit 1
fi

echo "New version is -$NEW_VERSION-"

## Verify successful deployment
# FIXME: enable comparsion
# if [ "$CURRENT_VERSION" != "$NEW_VERSION" ]; then
#     echo "Stack deployment successful."
# else
#     echo "Stack deployment failed."
#     exit 1
# fi