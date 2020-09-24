const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1'
const INDEX_URL = BASE_URL + '/users'
// const SHOW_API = INDEX_URL + `${id}`
const USERS_PER_PAGE = 12
const users = []
let filteredUsers = []
let nowPage = 1

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const switchGenderBtn = document.querySelector('#switch-gender-btn')
const switchCardListBtn = ('#switch-card-list-btn')
let usersPanel = document.querySelector('#users-panel')

axios
  .get(INDEX_URL)
  .then(function (response) {

    for (const user of response.data.results) {
      users.push(user)
    }
    start()
  })
  .catch((error) => console.log(error))


function start() {

  renderPaginator(users.length)
  renderUserList(getUsersByPage(1))

  switchGenderBtn.addEventListener('click', function (event) {
    if (event.target.matches('#male-btn')) {
      filteredGender('male')
    } else if (event.target.matches('#female-btn')) {
      filteredGender('female')
    } else if (event.target.matches('#all-btn')) {
      filteredUsers = []
      renderUserList(getUsersByPage(1))
      renderPaginator(users.length)
    }
  })


  //渲染用戶資料
  function renderUserList(data) {
    let rawHTML = ''
    data.forEach((item) => {

      rawHTML += `  
  <div id="${item.id}" class="card m-2 " style="width:250px; border-radius:50%;align-items:center;">
    <img src="${item.avatar}" alt="..." style="width:150px; border-radius:50%; padding-top:10px;">
    <div class="card-body text-center">
      <h6 class="card-title" style="font-size:20px; font-family:Apple Chancery, cursive, sans-serif;">${item.name} ${item.surname}</h6>
      <button href="#"class="btn btn-outline-info btn-more-info" data-id="${item.id}" data-toggle="modal" data-target="#more-info-modal">More info</button>
      <i class="fas fa-user-plus btn-add-favorite ml-2" style="color:#FFAAD5;" data-id="${item.id}"></i>
    </div>
  </div>`
    })
    usersPanel.innerHTML = rawHTML
  }

  function filteredGender(gender) {

    filteredUsers = users.filter((user) => user.gender === gender)
    //設定users.filter拿出來的用戶gender等於參數的gender，輸出true的資料存入filteredUsers
    renderUserList(getUsersByPage(1))
    renderPaginator(filteredUsers.length)
  }


  //分頁器切割用戶資料  依照頁數渲染資料
  function getUsersByPage(page) {

    const data = filteredUsers.length ? filteredUsers : users

    const startIndex = (page - 1) * USERS_PER_PAGE
    return data.slice(startIndex, startIndex + USERS_PER_PAGE)
  }

  //製作分頁器頁碼
  function renderPaginator(amount) {
    const numbersOfPage = Math.ceil(amount / USERS_PER_PAGE)
    let rawHTML = ""

    for (let page = 1; page <= numbersOfPage; page++) {

      rawHTML += `
          <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `
    }
    paginator.innerHTML = rawHTML

  }

  //分頁器點擊監聽器
  paginator.addEventListener('click', function ocPaginatorClicked(event) {
    if (event.target.tagName !== 'A') return

    const page = Number(event.target.dataset.page)
    renderUserList(getUsersByPage(page))
  })

  //搜尋功能
  searchForm.addEventListener('submit', function onSearchUsersClicked(event) {
    event.preventDefault()
    console.log(event.target)

    const keyword = searchInput.value.trim().toLowerCase()

    filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword)
    )
    renderSearchResult(filteredUsers)

  })

  function renderSearchResult(data) {
    if (data.length === 0) {
      alert("Not found!")
    } else {
      renderUserList(getUsersByPage(1))
      renderPaginator(filteredUsers.length)
    }
  }

}

//按紐監聽
usersPanel.addEventListener('click', function moreInfoClicked(event) {
  if (event.target.matches('.btn-more-info')) {
    showMoreInfo(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

//蒐藏最愛函式
function addToFavorite(id) {

  const list = JSON.parse(localStorage.getItem('favoriteList')) || []
  const user = users.find((user) => user.id === id)

  if (list.some((user) => user.id === id)) {
    return alert('用戶已被收藏過')
  }

  list.push(user)
  alert('收藏成功！')
  localStorage.setItem('favoriteList', JSON.stringify(list))

}


//Modal彈窗
function showMoreInfo(id) {
  const modalName = document.querySelector('#modal-user-name')
  const modalUserAvatar = document.querySelector('#modal-user-avatar')
  const modalGender = document.querySelector('#modal-gender')
  const modalBirthday = document.querySelector('#birthday')
  const modalAge = document.querySelector('#modal-age')
  const modalEmail = document.querySelector('#modal-email')

  axios.get(INDEX_URL + '/' + id).then((response) => {
    const data = response.data
    modalName.innerText = data.name
    modalUserAvatar.src = data.avatar
    modalGender.innerText = data.gender
    modalBirthday.innerText = data.birthday
    modalAge.innerText = data.age
    modalEmail.innerText = data.email
  })

}