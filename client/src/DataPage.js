import React from 'react'
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'

const apiURL = process.env.NODE_ENV === 'production'
? 'https://myproject0-cfcb6ea32979.herokuapp.com/api'
: 'http://localhost:3000/api';

function Table({ data }) {
  return (
<div>
    <h1>User Data</h1>
    <table border="1">
      <thead>
        <tr>
          <th>email</th>
          <th>about me</th>
          <th>address</th>
          <th>birthday</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.email}</td>
            <td>{row.about_me}</td>
            <td>{row.address}</td>
            <td>{row.birthday}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default function DataPage() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch(`${apiURL}api/userData`)
    .then(res => res.json())
    .then(data => setData(data))
  }, [])

  return (
    <>
     <Helmet>
      <title>Data</title>
     </Helmet>
    <Table data={data} />
    </>
);
}