'use strict';

export const main = async () => {
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: `Hello, world! Your function executed successfully!`
            },
            null,
            2
        )
    }
}
