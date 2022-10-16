const wrapper = document.querySelector(".wrapper")

wrapper.insertAdjacentHTML(
  "beforeEnd",
  `
  <div id="birthday">
    <div id="birthday__container">
        <h1 id="birthday__title">Узнайте сколько времени осталось до вашего дня рождения</h1>
        <p id="birthday__text">Введите дату  следующего дня рождения</p>
        <div id="birthday__body">
          <input id="birthday__date" type='tel' maxlength='10' placeholder='ДД.ММ.ГГГГ'/>
          <button id="birthday__btn" type='button'>Посчитать</button>
          <button id="birthday__clear" type='button'>Очистить</button>
        </div>
        <p id="birthday__subtext"></p>
        <div id="birthday__timer">
          <div id='years'></div>
          <div id='months'></div>
          <div id='days'></div>
          <div id='hours'></div>
          <div id='minutes'></div>
          <div id='seconds'></div>
        </div>
      </div>
    </div>
  `
)

const getDate = document.getElementById("birthday__date")
const btnTimerDate = document.getElementById("birthday__btn")
const btnClearDate = document.getElementById("birthday__clear")
const subtext = document.getElementById("birthday__subtext")

btnClearDate.style = "display:none"

let deadline = new Date()

function timer() {
  function getTimeRemaining(endtime) {
    let time = Date.parse(endtime) - Date.parse(new Date())
    const years = Math.floor(time / (1000 * 60 * 60 * 24 * 30 * 12))
    const month = Math.floor(time / (1000 * 60 * 60 * 24 * 30)) % 12
    const days = Math.floor(time / (1000 * 60 * 60 * 24)) % 30
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((time / 1000 / 60) % 60)
    const seconds = Math.floor((time / 1000) % 60)

    return {
      total: time,
      years,
      month,
      days,
      hours,
      minutes,
      seconds,
    }
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`
    } else {
      return num
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector)
    const years = timer.querySelector("#years")
    const months = timer.querySelector("#months")
    const days = timer.querySelector("#days")
    const hours = timer.querySelector("#hours")
    const minutes = timer.querySelector("#minutes")
    const seconds = timer.querySelector("#seconds")
    const timeInterval = setInterval(updateClock, 1000)

    updateClock()

    function updateClock() {
      const time = getTimeRemaining(endtime)
      years.innerHTML = `${getZero(time.years)} лет`
      months.innerHTML = `${getZero(time.month)} месяцев`
      days.innerHTML = `${getZero(time.days)} дней`
      hours.innerHTML = `${getZero(time.hours)} часов`
      minutes.innerHTML = `${getZero(time.minutes)} минут`
      seconds.innerHTML = `${getZero(time.seconds)} секунд`

      if (time.total <= 0) {
        clearInterval(timeInterval)
      }

      btnClearDate.addEventListener("click", () => {
        clearInterval(timeInterval)
        time.total = 0
        closeBtnClear()
      })
    }
  }

  getTimeRemaining(deadline)
  setClock("#birthday__timer", deadline)
}

getDate.addEventListener("input", (e) => {
  let target = e.target.value.trim()
  let length = target.length

  const day = target.substring(0, 2)
  const month = target.substring(3, 5)
  const year = target.substring(6, 10)

  const date = `${year}. ${month}. ${day}`

  if (length === 10) {
    if (Date.parse(date) < Date.parse(new Date())) {
      const todayMonth =
        new Date().getMonth() + 1 != 11
          ? new Date().getMonth() + 1
          : `0${new Date().getMonth()}`

      const todayDate =
        new Date().getDate() + 1 != 11
          ? new Date().getDate()
          : `0${new Date().getDate()}`

      const todayFullYear = new Date().getFullYear()
      const today = `${todayDate}.${todayMonth}.${todayFullYear}`

      alert(`Указанная дата меньше ${today}`)
      closeBtnClear()
    } else {
      btnTimerDate.addEventListener("click", () => {
        timer()
        openBtnClear()
      })
      localStorage.setItem("deadline", date)

      deadline = new Date(date)
    }
  }
})

getDate.addEventListener("keyup", (e) => {
  let target = e.target.value.trim()
  let length = target.length

  if (e.key === "Backspace") {
    target = ""
  }

  if (target[0] + target[1] > 31) {
    alert("Дата введена не верно")
    getDate.value = ""
    target = ""
  } else if (length === 2 && target[0] + target[1] < 32) {
    getDate.value = `${target}.`
  }

  if (target[3] + target[4] > 12) {
    alert("Месяц введён не верно")
    getDate.value = ""
    target = ""
  } else if (length === 5 && target[3] + target[4] < 13) {
    getDate.value = `${target}.`
  }

  if (length === 10) {
    if (e.key === "Enter") {
      timer()
      openBtnClear()
    }
  }

  if (length < 10 && e.key === "Enter") {
    alert("Дата указана неверно. Введите дату в формате дд.мм.гггг")
  }
})

btnTimerDate.addEventListener("click", () => {
  if (getDate.value != "" && getDate.value.length < 10) {
    alert("Дата указана неверно. Введите дату в формате дд.мм.гггг")
  }

  if (getDate.value === "") {
    deadline = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1
    )

    const data = `${
      new Date().getDate() < 10
        ? `0${new Date().getDate()}`
        : new Date().getDate()
    }.${
      new Date().getMonth() < 10
        ? `0${new Date().getMonth()}`
        : new Date().getMonth()
    }.${new Date().getFullYear()}`

    subtext.style = "display:block"

    alert(
      `Дата рождения не была введена, в качестве даты будет указано '${data}'`
    )

    subtext.innerHTML = `До '${data}' осталось:`

    timer()
    openBtnClear()
  }
})

if (localStorage.getItem("deadline")) {
  deadline = new Date(localStorage.getItem("deadline").trim())

  const day = localStorage.getItem("deadline").substring(10, 12)
  const month = localStorage.getItem("deadline").substring(6, 8)
  const year = localStorage.getItem("deadline").substring(0, 4)
  const date = `${day}.${month}.${year}`

  getDate.value = date
  subtext.innerHTML = `До ${date} осталось:`

  btnTimerDate.style = "display:none"
  btnClearDate.style = "display:inline-block"
  getDate.setAttribute("disabled", "disabled")
  timer()
}

function openBtnClear() {
  btnTimerDate.style = "display:none"
  btnClearDate.style = "display:inline-block"
  subtext.style = "display:block"
  document.getElementById("birthday__timer").style = "display:flex"

  getDate.setAttribute("disabled", "disabled")

  if (getDate.value != "") {
    // subtext.innerHTML = `До ${getDate.value} осталось:`
    subtext.innerHTML = `До дня рождения осталось:`
  }
}

function closeBtnClear() {
  btnTimerDate.style = "display:inline-block"
  btnClearDate.style = "display:none"
  subtext.style = "display:none"
  document.getElementById("birthday__timer").style = "display:none"

  getDate.removeAttribute("disabled", "disabled")
  getDate.value = ""

  localStorage.removeItem("deadline")

  deadline = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 1
  )
}
