import React from 'react'

export default function Header({ title }: { title:any }) {
  return (
    <div className='text-4xl max-[380px]:text-2xl sm:text-5xl font-extrabold'>{title}</div>
  )
}
