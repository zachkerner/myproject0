import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { isPagesSame, isPagesSelectionValid, isPagesModified } from './utils/utils.js'
const apiURL = "https://myproject0-cfcb6ea32979.herokuapp.com/"


function Controller({ label, localPage, setLocalPage }) {
  const handleChange = (e) => {
    const newPage = Number(e.target.value)
    setLocalPage(newPage)
  }

  return (
    <div>
      <select value={localPage} onChange={handleChange}>
        <option value="2">page 2</option>
        <option value="3">page 3</option>
      </select>
      <br/>
      <label>{label}</label>
      <br/><br/>
    </div>
  )
}

function Form({ data }) {
  const getPage = (fieldName) => {
    const field = data.find(item => item.field === fieldName);
    return field ? field.page : null;
  };

  const [localPages, setLocalPages] = useState({
    birthday: getPage('birthday'),
    aboutMe: getPage("aboutMe"),
    address: getPage("address")
  })

  const dbPages = {
    birthday: getPage('birthday'),
    aboutMe: getPage('aboutMe'),
    address: getPage('address')
  }

  const handlePageChange = (field, newValue) => {
    setLocalPages((prevPages) => ({
      ...prevPages,
      [field]: newValue
    }))
  }

  
  const mutation = useMutation({
    mutationFn: (arr) => {

      fetch(`${apiURL}api/updateFields`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ fieldsToUpdate: arr})
      })
      .then(res => {
        res.json()
      
      })
      .catch(err => console.error("mutationFn try catch"))
    }
  })
    
  const handleClick = (e) => {
    e.preventDefault()
    if (isPagesSame(localPages.birthday, localPages.aboutMe, localPages.address,
      dbPages.birthday, dbPages.aboutMe, dbPages.address)) {
        return true
      }
    
    if (!isPagesSelectionValid(localPages.birthday, localPages.aboutMe, localPages.address)) {
      alert('invalid selection')
      return true
    }

    const modifiedPagesArr = isPagesModified(
      localPages.birthday, localPages.aboutMe, localPages.address, 
      dbPages.birthday, dbPages.aboutMe, dbPages.address
    );

    mutation.mutate(modifiedPagesArr)
    window.location.reload()
  }

  return (
    <div>
      <Controller label={"birthday"} localPage={localPages.birthday} setLocalPage={(newPage) => handlePageChange('birthday', newPage)} />
      <Controller label={"about me"} localPage={localPages.aboutMe} setLocalPage={(newPage) => handlePageChange('aboutMe', newPage)} />
      <Controller label={"address"} localPage={localPages.address} setLocalPage={(newPage) => handlePageChange('address', newPage)} />
      <br/><br/>
      <button onClick={handleClick}>Apply</button>
      <br/><br/>
    </div>
  )
}

export default function AdminPage({ data }) {
  return (
    <div>
      <Helmet>
        <title>Admin</title>
      </Helmet>
      <h1>Welcome to the Admin Page</h1>
      <Link to="/">
        <button>Home</button>
      </Link>
      <br/><br/>
      <Form data={data}/>
    </div>
  )
}