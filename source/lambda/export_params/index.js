/*********************************************************************************************************************
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.                                           *
 *                                                                                                                    *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance    *
 *  with the License. A copy of the License is located at                                                             *
 *                                                                                                                    *
 *      http://www.apache.org/licenses/LICENSE-2.0                                                                    *
 *                                                                                                                    *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES *
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions    *
 *  and limitations under the License.                                                                                *
 *********************************************************************************************************************/
 const aws = require('aws-sdk');
 var lambda = new aws.Lambda();
 

exports.handler = async (event, context) => {
    console.log("event="+JSON.stringify(event));

    for (var record of event.Records) { 

        console.log('Stream record: ', JSON.stringify(record));

        var db_item = record.dynamodb.NewImage;
        console.log("db_item="+JSON.stringify(db_item));
        console.log("db_item['score_threshold']="+db_item['score_threshold']);
        console.log("db_item['score_threshold']['N']="+db_item['score_threshold']['N']);
        if(! parseFloat(db_item['score_threshold']['N'])>1)
            throw new Error('Score_threshold is lower than 1');


        var params = {
            FunctionName: process.env.SUBMIT_QUERY_FUNCTION,
            Environment: {
                'Variables': {
                    'ip_penalty': db_item['ip_penalty']['N'],
                    'referer_penalty': db_item['referer_penalty']['N'],
                    'ua_penalty': db_item['ua_penalty']['N'],
                    'ip_rate': db_item['ip_rate']['N'],
                    'uri_column_name': db_item['uri_column_name']['S'],
                    'referer_column_name': db_item['referer_column_name']['S'],
                    'ua_column_name': db_item['ua_column_name']['S'],
                    'request_ip_column': db_item['request_ip_column']['S'],
                    'status_column_name': db_item['status_column_name']['S'],
                    'response_bytes_column_name': db_item['response_bytes_column_name']['S'],
                    'date_column_name': db_item['date_column_name']['S'],
                    'time_column_name': db_item['time_column_name']['S'],
                    'db_name': db_item['db_name']['S'],
                    'table_name': db_item['table_name']['S'],
                    'min_sessions_number': db_item['min_sessions_number']['N'],
                    'min_session_duration': db_item['min_session_duration']['N'],
                    'score_threshold': db_item['score_threshold']['N'],
                    'partitioned': db_item['partitioned']['N'],
                    'lookback_period': db_item['lookback_period']['N']
                }
            }
        };
        console.log("params="+JSON.stringify(params));
        const result = await lambda.updateFunctionConfiguration(params).promise();
        console.log(result);
        console.log(`Lambda function ${process.env.SUBMIT_QUERY_FUNCTION} configuration updated`);

        
    }

    return "OK";
    
    
};