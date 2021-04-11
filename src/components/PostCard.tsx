import { Link } from "gatsby"
import React from "react"

export type TPostCard = {
  title: string
  slug: string
  excerpt: string
  date: string
}

const PostCard: React.FC<TPostCard> = ({ title, slug, excerpt, date }) => {
  return (
    <li className="flex-fluid md:flex-1/2 lg:flex-1/3 md:px-4 pb-4 flex">
      <Link to={slug} className="block border rounded-lg self-stretch w-full">
        <div className="p-4">
          <h2 className="font-bold text-xl">{title}</h2>
          <time className="text-secondary">{date}</time>
          <p>{excerpt}</p>
        </div>
      </Link>
    </li>
  )
}

export default PostCard
