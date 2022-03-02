function criteoAppendTag (trackId) {
  const script = document.createElement('script')
  script.async = true
  script.src = `//dynamic.criteo.com/js/ld/ld.js?a=${trackId}`
  const target = document.getElementsByTagName('head')[0] || document.body
  target.appendChild(script)
}

window.criteoTrackingId = 91683
criteoAppendTag(criteoTrackingId)
window.criteo_q = window.criteo_q || []
window.deviceType = /iPad/.test(navigator.userAgent) ? 't' : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? 'm' : 'd'

window.criteo_q.push(
  { event: 'setAccount', account: window.criteoTrackingId },
  { event: 'setSiteType', type: window.deviceType },
  { event: 'viewPage' },
)

window.pushCriteoEvent = function (eventName, payload) {
  window.criteo_q.push(
    { event: 'setAccount', account: window.criteoTrackingId },
    { event: 'setSiteType', type: window.deviceType },
    {
      event: eventName,
      ...payload,
    },
  )
}
