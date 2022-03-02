function Header () {
  const app = document.getElementsByClassName('app')[0]
  const header = document.createElement('h1')
  header.innerHTML = "Header"
  app.appendChild(header)
}

export default Header