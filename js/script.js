let container = document.querySelector(".container")
let input = document.querySelector(".input")
let data;
let dataEl = []

function createEl(elTag, elClass) {
  let el = document.createElement(elTag)
  el.classList.add(elClass)
  return el
}

function createLi(text) {
  let optionsEl = document.querySelector(".options")
  let el = createEl("li", "options__item")
  el.textContent = text
  optionsEl.append(el)
}

function createUl() {
  let el = createEl("ul", "options")
  input.after(el)
  el.addEventListener("click", (event) => {
    dataEl.forEach((el) => {
      if (el.full_name === event.target.textContent) {
        createFavorites(el.name, el.owner.login, el.stargazers_count)
        deleteUl()
        input.value = ""
      }
    })
  })
}


function createFavorites(name, owner, stars) {
  let favorites = document.querySelector(".favorites")
  let item = createEl("div", "favorites__item")
  favorites.append(item)
  let itemName = createEl("div", "item__name")
  itemName.textContent = `Name: ${name}`
  item.append(itemName)
  let itemOwner = createEl("div", "item__owner")
  itemOwner.textContent = `Owner: ${owner}`
  item.append(itemOwner)
  let itemStars = createEl("div", "item__stars")
  itemStars.textContent = `Stars: ${stars}`
  item.append(itemStars)
  let itemClose = createEl("div", "item__close")
  item.append(itemClose)
  function closeFavorites() {
    item.remove()
    item.removeEventListener("click", closeFavorites)
  }
  itemClose.addEventListener("click", closeFavorites)
}



function deleteUl() {
  let optionsEl = document.querySelector(".options")
  if (optionsEl) {
    optionsEl.remove()
  }
}


const debounce = (fn, debounceTime) => {
  let timeout;
  return function() {
    const fnCall = () => {
      fn.apply(this, arguments)
    }
    clearTimeout(timeout)
    timeout = setTimeout(fnCall,debounceTime)
  }
};

async function getData(text) {
  if (text) {
    return await fetch(`https://api.github.com/search/repositories?q=${text}&per_page=5`)
    .then((answ) => {
      deleteUl();
      createUl();
      dataEl = [];
      data = answ.json()
      return data
    })
    .then((res) => res.items.forEach(element => {
      dataEl.push(element)
      createLi(element.full_name)
  }))
  .catch(error => {
    alert(error)  
  })
  }

}


function clearInput(e) {
  if(!e.target.value) {
    deleteUl()
  }
}


function search(e) {
  getData(e.target.value) 
}


input.addEventListener("keyup", clearInput)

let delay = debounce(search, 500)
input.addEventListener("keyup", delay)


