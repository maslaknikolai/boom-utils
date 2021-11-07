// ==UserScript==
// @name           Boom utils
// @version        1.0.1
// @description    Делать вещи быстрее
// @author         Maslak Nikolai
// @include        https://control.um-agency.com/*
// @grant          GM.xmlHttpRequest
// @grant          GM_xmlhttpRequest
// @grant          GM_download
// @grant          GM_info
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_addValueChangeListener
// @grant          GM_notification
// @grant          GM.setValue
// @grant          GM.getValue
// @grant          GM.deleteValue
// @grant          GM.listValues
// @grant          unsafeWindow
// @grant          GM.addValueChangeListener
// @require        https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @run-at         document-end
// @allFrames      true
// ==/UserScript==

async function start() {
    const boomUtilsDataRaw = getQuery().boomUtilsData
    if (!boomUtilsDataRaw) {
        return
    }

    const boomUtilsData = JSON.parse(boomUtilsDataRaw)

    if (boomUtilsData.action === 'editPlaylist') await editPlaylist(boomUtilsData)
    if (boomUtilsData.action === 'fillPlaylist') await fillPlaylist(boomUtilsData)
}

start()

async function editPlaylist(boomUtilsData) {
    const ids = boomUtilsData.ids

    const btns = Array.from(document.querySelectorAll('.sonata-ba-list-field.sonata-ba-list-field-actions a'))

    if (btns.length === 0) {
      return
    }

    const fillPlaylistData = {
      action: 'fillPlaylist',
      ids
    }

    btns.forEach((btn) => {
      btn.href = `${btn.href}?boomUtilsData=${encodeURIComponent(JSON.stringify(fillPlaylistData))}`
      btn.style.background = 'rgb(238 241 28)'
    })

    if (btns.length === 1) {
      btns[0].click()
    }
}

async function fillPlaylist(boomUtilsData) {
    const ids = boomUtilsData.ids

    const date = moment()
    const dateStr = date
      .startOf('day')
      .day(4)
      .format('YYYY-MM-DD HH:mm')

    await sleep(1000)

    const importDateInput = document.querySelector('[name*=import_date')
    importDateInput.value = dateStr
    importDateInput.style.background = 'rgb(238 241 28)'

    const elementsCount = document.querySelector('#elementsCount')
    const addBtnEl = elementsCount.parentElement.parentElement.querySelector('[title="Добавить новый"]')

    elementsCount.value = ids.length
    addBtnEl.click()

    await sleep(2000)

    const idsInputs = document.querySelectorAll('.sonata-ba-tbody.ui-sortable td:nth-child(4) input')

    Array.from(idsInputs)
        .slice(0, ids.length)
        .forEach((trackIdInputEl, i) => {
            trackIdInputEl.style.background = 'rgb(238 241 28)'
            trackIdInputEl.value = ids[i]
        })
}

//
//
// utils
//
//

function sleep(ms){
    return new Promise(r => setTimeout(r, ms))
}

function getQuery() {
    return Object.fromEntries(
        location.search
            .slice(1)
            .split('&')
            .map((searchParam) => {
                const sp = searchParam.split('=')
                return [sp[0], decodeURIComponent(sp[1])]
            })
            .filter((i) => i[0])
    )
}
