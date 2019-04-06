import React from 'react'
import gql from 'graphql-tag'
import Head from 'next/head'
import { Query } from 'react-apollo'
import Link from 'next/link'
import PaginationStyles from './styles/PaginationStyles'
import { perPage } from '../config'

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY{
    itemsConnection {
      aggregate{
        count
      }
    }
  }
`

const Pagination = props => (
  <Query query={PAGINATION_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return (<p>Loading...</p>)
      if (!data) return (<p>Data is not found!</p>)
      const count = data.itemsConnection.aggregate.count
      const pages = Math.ceil(count / perPage)
      const page = props.page || 1
      return (
        <PaginationStyles>
          <Head>
            <title>Sick Fits! Page {} of {pages}</title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: page - 1 }
            }}>
            <a className="prev" aria-disabled={page <= 1}><i class="material-icons">skip_previous</i></a>
          </Link>
          <p>
            Page {page} of {pages}
          </p>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: page + 1 }
            }}>
            <a className="prev" aria-disabled={page >= pages}><i class="material-icons">skip_next</i></a>
          </Link>
          <p>
            {count} items total
          </p>
        </PaginationStyles>
      )
    }}
  </Query>

)

export default Pagination
