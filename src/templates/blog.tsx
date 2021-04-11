import React from "react"
import { graphql } from "gatsby"
import Tags from "../components/Tags"

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const {
    frontmatter: { title, date, tags },
    html,
  } = markdownRemark
  return (
    <article className="mx-auto my-12 max-w-prose">
      <header>
        <Tags tags={tags} className="mb-6" />
        <h1 className="mb-2 text-4xl font-bold">{title}</h1>
        <time className="text-secondary mb-4 block">{date}</time>
      </header>
      <div className="prose mt-8" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  )
}
export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        tags
      }
    }
  }
`
