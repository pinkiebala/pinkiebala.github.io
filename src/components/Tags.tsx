import React from "react"

const Tags: React.FC<{ tags: string[]; className?: string }> = ({
  tags,
  className = "",
}) => {
  return (
    <ul className={className}>
      {tags.map(tag => (
        <li
          key={tag}
          className="inline-block px-2 mr-2 last:mr-0 bg-gray-200 text-sm"
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}

export default Tags
