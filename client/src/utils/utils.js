export { isPagesSame, isPagesSelectionValid, isPagesModified, validateEmail, validatePassword, getPage }

function isPagesSame(localBirthdayPage, localAboutMePage, localAddressPage,
  dbBirthdayPage, dbAboutMePage, dbAddressPage
) {
  return localBirthdayPage === dbBirthdayPage &&
  localAboutMePage === dbAboutMePage && 
  localAddressPage === dbAddressPage

}

function isPagesSelectionValid(localBirthdayPage, localAboutMePage, localAddressPage) {
  const SECONDPAGE = 2
  const THIRDPAGE = 3
  const pageNums = [localBirthdayPage, localAboutMePage, localAddressPage]
  const page2 = pageNums.filter(page => page === SECONDPAGE)
  const page3 = pageNums.filter(page => page === THIRDPAGE)

  return page2.length > 0 && page3.length > 0
}

function isPagesModified(localBirthdayPage, localAboutMePage, localAddressPage, 
  dbBirthdayPage, dbAboutMePage, dbAddressPage
) {
  const result = []

if (localBirthdayPage !== dbBirthdayPage) result.push({field: "birthday", page: localBirthdayPage})
if (localAboutMePage !== dbAboutMePage) result.push({field: "aboutMe", page: localAboutMePage})
if (localAddressPage !== dbAddressPage) result.push({field: "address", page:localAddressPage})

return result
}

function getPage (fieldName, data) {
  const field = data.find(item => item.field === fieldName);
  return field ? field.page : null;
};

function validateEmail (email) {
  if (!email) return false
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

function validatePassword (password) {
  if (!password) return false
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  return re.test(password)
}