import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'
import HomePage from './HomePage.js'
import AdminPage from './AdminPage.js'
const apiURL = "https://myproject0-cfcb6ea32979.herokuapp.com"

export default function Parent() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['fieldsData'],
    queryFn: () =>
      fetch(`${apiURL}/api/fields`).then((res) => res.json()),
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