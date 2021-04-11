import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/seo"
import PostCard from "../components/PostCard"
import Landing from "../components/landing"
const IndexPage = ({
  data: {
    allMarkdownRemark: { edges },
  },
}) => (
  <Layout>
    <SEO title="Home" />
    <div className="container pt-10 pb-5">
      <div className="mb-5 text-center">
        <h1 className="text-3xl font-bold">Pinkie Notes</h1>
        <p className="text-secondary  ">學習筆記，避免踩到重複的坑</p>
      </div>
      <Landing />
    </div>

    <div className="container">
      <ul className="md:-mx-4 flex flex-wrap">
        {edges.map(
          ({
            node: {
              excerpt,
              frontmatter: { slug, title, date },
            },
          }) => (
            <PostCard
              key={slug}
              slug={slug}
              title={title}
              excerpt={excerpt}
              date={date}
            />
          )
        )}
      </ul>
    </div>
  </Layout>
)

export default IndexPage

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          excerpt(pruneLength: 100, truncate: true)
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            slug
            title
          }
        }
      }
    }
  }
`
