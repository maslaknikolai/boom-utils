// ==UserScript==
// @name           Boom utils
// @version        1.0.1
// @description    Делать вещи быстрее
// @author         Maslak Nikolai
// @include        https://maslaknikolai.github.io/boom-utils/test-us.html*
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
// @run-at         document-end
// @allFrames      true
// ==/UserScript==

async function start() {
    const boomUtilsDataRaw = getQuery().boomUtilsData
    if (!boomUtilsDataRaw) {
        return
    }

    const boomUtilsData = JSON.parse(boomUtilsDataRaw)

    if (boomUtilsData.action === 'fillAlbum') await fillAlbum(boomUtilsData)
}

start()

async function fillAlbum(boomUtilsData) {
    const ids = boomUtilsData.ids

    const addInputEl = document.querySelector('.add-count')
    const addBtnEl = document.querySelector('.add-btn')

    addInputEl.value = ids.length
    addBtnEl.click()

    await sleep(500)

    Array.from(document.querySelectorAll('.track-id'))
        .slice(0, ids.length)
        .forEach((trackIdInputEl, i) => {
            trackIdInputEl.value = ids[i]
        })
}

//
//
// utils
//
//

console.log(1);

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
