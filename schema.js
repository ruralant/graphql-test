const axios = require('axios');

const {
    // import from GraphQL all the object types that we will work with
  GraphQLObjectType,
  GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = require('graphql');


const CustomerType = new GraphQLObjectType({
	name: 'Customer',
	fields: () => ({
		id: {type: GraphQLString},
		name: {type: GraphQLString},
		email: {type: GraphQLString},
		age: {type: GraphQLInt},
	})
});

// Root query (always required)
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		customer: {
			type: CustomerType,
			args: {
				id:{ type: GraphQLString },
			},
			resolve(parentValue, args){
				return axios.get('http://localhost:3000/customers/' + args.id)
					.then(res => res.data);
			}
		},
		customers: {
			type: new GraphQLList(CustomerType),
			resolve(parentValue, args){
				return axios.get('http://localhost:3000/customers/')
					.then(res => res.data);
			}
		}
	}
});

// Mutations
const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields:{
		// POST
		addCustomer: {
			type: CustomerType,
			args: {
				name: {type: new GraphQLNonNull(GraphQLString)},  // the Name is a required field
				email: {type: new GraphQLNonNull(GraphQLString)},
				age: {type: new GraphQLNonNull(GraphQLInt)}
			},
			resolve(parentValue, args) {
				return axios.post('http://localhost:3000/customers', {
					name: args.name,
					email: args.email,
					age: args.age
				})
				.then(res => res.data);
			}
		},
		// DELETE
		deleteCustomer: {
			type: CustomerType,
			args: {
				id: {type: new GraphQLNonNull(GraphQLString)}
			},
			resolve(parentValue, args) {
				return axios.delete('http://localhost:3000/customers/' + args.id)
				.then(res => res.data);
			}
		},
		// UPDATE
		editCustomer: {
			type: CustomerType,
			args: {
				id: {type: new GraphQLNonNull(GraphQLString)},
				name: {type: GraphQLString},
				email: {type: GraphQLString},
				age: {type: GraphQLInt}
			},
			resolve(parentValue, args) {
				return axios.patch('http://localhost:3000/customers/' + args.id, args)
				.then(res => res.data);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation
});