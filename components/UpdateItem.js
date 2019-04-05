import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';


const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id:ID!){
        item(where:{id:$id}){
            id
            title
            description
            price
        }
    }
`;

const UPDATE_DATA_MUTATION = gql`
    mutation UPDATE_DATA_MUTATION(
        $id: ID!
        $title: String
        $description: String
        $price: Int
        ){
        updateItem(
            id: $id
            title: $title
            description: $description
            price: $price
        ){
            id
            title
            description
            price
        }
    }
`;


class UpdateItem extends Component {
  state = {};

  handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;

    this.setState({ [name]: val })
  };
  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    console.log('Updating Item!!');
    console.log(this.state);
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
    console.log('Updated');
  };
  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{
        id: this.props.id
      }}>
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>
          if (!data.item) return <p>No Item Found for ID</p>
          return (
            <Mutation
              mutation={UPDATE_DATA_MUTATION}
              variables={this.state}
            >
              {(updateItem, { loading, error }) => (
                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                        <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        onChange={this.handleChange}
                        defaultValue={data.item.title}
                      />
                    </label>
                    <label htmlFor="price">
                      Price
                        <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        required
                        onChange={this.handleChange}
                        defaultValue={data.item.price}
                      />
                    </label>
                    <label htmlFor="description">
                      Decription
                        <textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        required
                        onChange={this.handleChange}
                        defaultValue={data.item.description}
                      />
                    </label>
                    <button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          )
        }}
      </Query>
    );
  }
}

export default UpdateItem;

export { UPDATE_DATA_MUTATION };