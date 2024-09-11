import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { validateEmail, validatePassword, getPage } from './utils/utils.js'
const apiURL = "https://myproject0-cfcb6ea32979.herokuapp.com/"

function FormEmailPassword({ page, setContinueDisabled, setUserEmail, userData, setUserData }) {
  const FIRST_PAGE = 1
  const [formState, setFormState] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [formDisabled, setFormDisabled] = useState({
    register: false,
    login: false
  })

  if (page !== FIRST_PAGE) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const resetState = () => {
    setSuccessMessage(null);
    setErrors({});
  };

  const validateForm = () => {
    const { email, password } = formState;
    const inputErrors = {};

    if (!validateEmail(email)) {
      inputErrors.email = "enter valid email like example@gmail.com";
    }

    if (!validatePassword(password)) {
      inputErrors.password = "valid passwords have 8+ characters with one letter and one number";
    }

    setErrors(inputErrors);
    return Object.keys(inputErrors).length === 0;
  };

  const handleSuccess = (type, userData=null) => {
    setFormDisabled({register: true, login: true })
    setContinueDisabled(false);
    setUserEmail(formState.email);
    if (type === "register") setSuccessMessage("registration successful");
    if (type === "login") {
      setSuccessMessage("Welcome back");
      setUserData(userData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const buttonType = e.nativeEvent.submitter.name;
    resetState();

    if (!validateForm()) return;

    const endpoint = buttonType === "register" ? "api/register" : "api/login"
    const responseBody = { email: formState.email, password: formState.password }

    try {
      const response = await fetch(`${apiURL}/${endpoint}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(responseBody)
      })

      const data = await response.json()
      if (response.status === 400) {
        if (data.error === "email_not_found") {
          setErrors((prev) => ({...prev, email: "email not found"}))
        } else if (data.error === "invalid_password") {
          setErrors((prev) => ({...prev, password: "invalid password"}))
        } else if (data.error === "email_already_exists") {
          setErrors((prev) => ({...prev, email: "email already exists"}))
        }
      } else if (response.status === 200) {
        const { userData } = data
        handleSuccess(buttonType, userData)
      }

    } catch(err) {
      console.error(err, "submission error")
    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          name="email"
          value={formState.email}
          onChange={handleInputChange}
          placeholder="email"
        />
        {errors.email && <p>{errors.email}</p>}
      </div>
      <div>
        <input
          type="password"
          name="password"
          value={formState.password}
          onChange={handleInputChange}
          placeholder="password"
        />
          {errors.password && <p>{errors.password}</p>}
          {errors.general && <p>{errors.general}</p>}
      </div>
      {successMessage && <p>{successMessage}</p>}
      <button type="submit" name="register" disabled={formDisabled.register}>
        Register
      </button>
      <button type="submit" name="login" disabled={formDisabled.login}>
        Log in
      </button>
    </form>
  );
}

  
function FieldAboutMe({ page, aboutMePage, aboutMeLocalText, setAboutMeLocalText}) {
  if (page !== aboutMePage) return null

  const handleChange = (e) => {
    e.preventDefault()
    setAboutMeLocalText(e.target.value)
  }
  
  return (
    <div>
      <textarea value={aboutMeLocalText} onChange={handleChange} rows="4" cols="50" placeholder="About me"/>
      <br/><br/>
    </div>
  )
}

function FieldAddress({ page, addressPage, addressLocalText, setAddressLocalText }) {
  if (page !== addressPage) return null

  const handleChange = (e) => {
    setAddressLocalText(e.target.value)
  }
  return (
    <div>
      <input value={addressLocalText} onChange={handleChange} type="text" placeholder="street address"/>
      <br/><br/>
    </div>
  )
}

function FieldBirthday({ page, birthdayPage, birthdayLocalData, setBirthdayLocalData }) {
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')

  const days = Array.from({ length: 31}, (_, i) => i + 1)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const years = Array.from({ length: 105}, (_, i) => new Date().getFullYear() - i)

  useEffect(() => {
    if (birthdayLocalData) {
      const [yearStr, monthStr, dayStr] = birthdayLocalData.split('-');
      setYear(yearStr);
      setMonth(months[parseInt(monthStr, 10) - 1]);
      setDay(parseInt(dayStr));
    }
  }, [birthdayLocalData]);

  const handleDateChange = () => {
    if (day && month && year) {
      const monthIndex = months.indexOf(month) + 1;
      const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : monthIndex;
      const formattedDay = day < 10 ? `0${day}` : day;

      const formattedDate = `${year}-${formattedMonth}-${formattedDay}`; 
      setBirthdayLocalData(formattedDate);
    }
  };

  useEffect(() => {
    handleDateChange();
  }, [day, month, year]);

  if (page !== birthdayPage) return null

  return (
    <div>
      <div>
        <label htmlFor="day">Day:</label>
        <select id="day" value={day} onChange={(e) => setDay(parseInt(e.target.value))} required>
          <option value="">Day</option>
          {days.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="month">Month:</label>
        <select id="month" value={month} onChange={(e) => setMonth(e.target.value)} required>
          <option value="">Month</option>
          {months.map((m, index) => (
            <option key={index} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="year">Year:</label>
        <select id="year" value={year} onChange={(e) => setYear(e.target.value)} required>
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <br/>
    </div>
  )
}

function FormFields({ page, addressPage, aboutMePage, birthdayPage, userEmail, userData, setUserData }) {
  const [aboutMeLocalText, setAboutMeLocalText] = useState("")
  const [addressLocalText, setAddressLocalText] = useState("")
  const [birthdayLocalData, setBirthdayLocalData] = useState("")

  useEffect(() => {
    if (userData) {
      setAboutMeLocalText(userData.about_me || "");
      setAddressLocalText(userData.address || "");
      setBirthdayLocalData(userData.birthday || "");
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = fetch(`${apiURL}/api/updateUser/${userEmail}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ aboutMe: aboutMeLocalText, address: addressLocalText, birthday: birthdayLocalData })
      })

      if (response.status === 200) {
      } else if (response.status === 500) {
      }

    } catch(err) {
      console.error(err, "formfields fetch error")
    }
  }

  let formButton;
  if (page === 1) {
    formButton = null
  } else {
    formButton = <button  type="submit">submit</button>
  }
  return (
    <form onSubmit={handleSubmit}>
      <FieldAboutMe page={page} aboutMePage={aboutMePage} aboutMeLocalText={aboutMeLocalText} setAboutMeLocalText={setAboutMeLocalText}/>
      <FieldAddress page={page} addressPage={addressPage} addressLocalText={addressLocalText} setAddressLocalText={setAddressLocalText}/>
      <FieldBirthday page={page} birthdayPage={birthdayPage} birthdayLocalData={birthdayLocalData} setBirthdayLocalData={setBirthdayLocalData}/>
      {formButton}
    </form>
  )
}

function Button({ type, page, setPage, maxPage }) {
  const FIRST_PAGE = 1
  const handleClick = (e) => {
    e.preventDefault()
    if (type === "next") {
      setPage(page + 1)
    } else {
      setPage(page - 1)
    }
  }
  if (type === "next" && (page === maxPage || page === FIRST_PAGE)) return null
  if (type === "back" && page === FIRST_PAGE) return null

  return (
    <>
      <br/>
      <button onClick={handleClick}>{type}</button>
    </>
    
  )
}

function Continue({ page, setPage, disabled}) {
  const REGISTRATION_PAGE = 1
  const FIELDS_FIRST_PAGE = 2
  if (page !== REGISTRATION_PAGE) return null

  const handleClick = () => {
    setPage(FIELDS_FIRST_PAGE)
  }
  return (
    <>
      <br/>
      <button disabled={disabled} onClick={handleClick}>continue</button>
    </>
  )
}

function Wizard({ data }) {
  const MAX_PAGE = 3
  const FIRST_PAGE = 1
  const [curPage, setCurPage] = useState(FIRST_PAGE)
  const [continueDisabled, setContinueDisabled] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const [userData, setUserData] = useState("")

  const dbPages = {
    birthday: getPage("birthday", data),
    aboutMe: getPage("aboutMe", data),
    address: getPage("address", data)
  }

  return (
    <>
      <FormEmailPassword page={curPage} setPage={setCurPage} setContinueDisabled={setContinueDisabled} setUserEmail={setUserEmail} userData={userData} setUserData={setUserData}/>
      <FormFields page={curPage} birthdayPage={dbPages.birthday} aboutMePage={dbPages.aboutMe} addressPage={dbPages.address} userEmail={userEmail} userData={userData} setUserData={setUserData}/>
      <Continue page={curPage} setPage={setCurPage} disabled={continueDisabled}/>
      <Button type={"next"} page ={curPage} setPage={setCurPage} maxPage={MAX_PAGE} />
      <Button type={"back"} page ={curPage} setPage={setCurPage} maxPage={MAX_PAGE} />
      <br/><br/>
    </>
  )
}

export default function HomePage({ data }) {
  return (
    <div>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <h1>Onboarding</h1>
      <Link to="/admin">
        <button>Admin</button>
      </Link>
      <br/><br/>
      <Wizard data={data}/>
    </div>
  )
}