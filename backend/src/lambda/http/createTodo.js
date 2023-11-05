import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'


export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const userId = getUserId(event)
    const newItem = await createTodo(data, userId)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        newItem
      })
    }
  })

