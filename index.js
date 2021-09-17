const express = require("express"); //import express
const expressGraphQL = require("express-graphql").graphqlHTTP; //import express-graphql
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = require('graphql'); //import objects from graphql

const countries = require("./countries"); // import countries array

const app = express();//Create an express object

//Define a graphQLObjectType which represent the structure of your data
const CountryType = new GraphQLObjectType({
    name: "countries",
    description: "Countries information",
    fields: () => ({
        countryId: {type: GraphQLNonNull(GraphQLInt),description:"This is the id of the country when arranged alphabetically"},
        countryCode: {type: GraphQLNonNull(GraphQLString)},
        countryName: {type: GraphQLNonNull(GraphQLString)},
        currencyCode: {type: GraphQLNonNull(GraphQLString)},
        population: {type: GraphQLNonNull(GraphQLString)},
        capital: {type: GraphQLNonNull(GraphQLString)},
        continentName: {type: GraphQLNonNull(GraphQLString)}
    })
})

//Define a root query that will be under the graphQLSchema
const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "This is a country api that gives you details about different countries",
    fields: () => ({
        worldCountries: {
            type: new GraphQLList(CountryType),
            description: "Information about countries",
            resolve: () => countries
        }
    })
})

//Define a schema which defines how data how related & gotten
const schema = new GraphQLSchema({
    query: RootQueryType
});

//Set express object(app) to make use of graphql
app.use('/graphql',expressGraphQL({
    schema:schema,
    graphiql: true  //This enables graphql to be access via a graphical user interface other than postman
}))

//Let add rest api to this
app.get('/api/countries',(req,res)=>{  //Check if the url path is /api/countries
    res.status(200).json(countries); //Send countries information back
})
app.get('/api/countries/:id',(req,res)=>{
    const countryId = req.params.id;
    if(countryId > countries.length){ //Check if the parameter id is greater than the numbers of countries
        res.status(200).json({
            message: "No country with country id:" + countryId.toString() + " is available"
        })
    }
    const oneCountry = countries.find(x => x.countryId == countryId); //Get just one country
    res.status(200).json(oneCountry);
})

//Check if the code is running in production environment
if(process.env.NODE_ENV === 'production'){ 
    app.listen(); //If code is running in production environment, just listen
}
else{
    const port = process.env.PORT || 5000;  //Set port that node server will listen on
    app.listen(port, () =>{console.log(`Server started on port ${port}`)})  
}