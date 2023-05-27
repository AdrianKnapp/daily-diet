const checkUidCookieExists = (cookies: string[]) => {
  const uidCookie = cookies[0].split(';')[0].split('=')[1]

  return !!uidCookie.length
}

export default checkUidCookieExists
