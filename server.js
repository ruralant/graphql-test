const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema.js');

const app = express();

// entry point for interact with GraphQL
app.use('/graphql', expressGraphQL({
    schema:schema,
    graphiql:true  // allows to use Graphiql ADI
}));

app.listen(4000, () => {
    console.log('server is running on port 4000');
});