import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
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
    }

    render() {
        return (
            <Form onSubmit={(e) => {
                e.preventDefault();
                console.log(this.state);
            }}>
                <fieldset>
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
        );
    }
}

export default CreateItem;