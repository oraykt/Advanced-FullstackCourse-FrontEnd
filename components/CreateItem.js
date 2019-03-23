import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

/*
createItem(
        title: String,
        description: String,
        price: Int,
        image: String,
        largeImage: String
        ):Item!
        
        */

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
        ){
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ){
            id
        }
    }
`;


class CreateItem extends Component {
    state = {
        title: 'Test Title',
        description: 'Test Description',
        image: 'testImage.jpg',
        largeImage: 'testLargeImage.jpg',
        price: 333
    };

    handleChange = (e) => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;

        this.setState({ [name]: val })
    };

    uploadFile = async (e) => {
        e.preventDefault();

        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_present', 'sickfits');
        const res = await fetch('https://api.cloudinary.com/v1_1/oraykurt-com/image/upload', {
            method: 'POST',
            body: data
        });
        const file = await res.json();
        console.log(file);
        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url
        });
    }

    render() {
        return (
            <Mutation
                mutation={CREATE_ITEM_MUTATION}
                variables={this.state}
            >
                {(createItem, { loading, error }) => (
                    <Form onSubmit={async (e) => {
                        // Stop the form from submitting
                        e.preventDefault();
                        // Call the mutation
                        const res = await createItem();
                        // Change them to the single item page
                        console.log(res);
                        Router.push({
                            pathname: '/item',
                            query: { id: res.data.createItem.id }
                        });
                    }}>
                        <Error error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="title">
                                Image
                        <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    placeholder="Upload an image"
                                    required
                                    onChange={this.uploadFile}
                                />
                            </label>
                            <label htmlFor="title">
                                Title
                        <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Title"
                                    required
                                    onChange={this.handleChange}
                                    value={this.state.title}
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
                                    value={this.state.price}
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
                                    value={this.state.description}
                                />
                            </label>
                            <button type="submit">Submit</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}

export default CreateItem;

export { CREATE_ITEM_MUTATION };