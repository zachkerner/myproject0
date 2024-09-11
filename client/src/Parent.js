import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'
import HomePage from './HomePage.js'
import AdminPage from './AdminPage.js'

export default function Parent() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['fieldsData'],
    queryFn: () =>
      fetch('http://localhost:3000/api/fields').then((res) => res.json()),
  })

  if (isLoading) return <div>Fetching posts...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  //console.log("Parent data", data)


  return (
    <Routes>
      <Route path="/" element={<HomePage data={data}/>} />
      <Route path="/admin" element={<AdminPage data={data}/>} />
    </Routes>
  )
}