const express = require("express"); //import express
const expressGraphQL = require("express-graphql").graphqlHTTP; //import express-graphql
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require('graphql'); //import objects from graphql

const app = express();//Create an express object

//Define a schema which defines how data how related & gotten
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "CountryApi", //Set the name of the query
        fields: () =>({
            message: {
                type: GraphQLString,
                resolve : () => "Hello world, this is country api"
            }
        })
    })
});

//Set express object(app) to make use of graphql
app.use('/graphql',expressGraphQL({
    schema:schema,
    graphiql: true  //This enables graphql to be access via a graphical user interface other than postman
}))

//Check if the code is running in production environment
if(process.env.NODE_ENV === 'production'){ 
    app.listen(); //If code is running in production environment, just listen
}
else{
    const port = process.env.PORT || 5000;  //Set port that node server will listen on
    app.listen(port, () =>{console.log(`Server started on port ${port}`)})  
}