/* eslint-disable */
// Start gtag configurations
window.GTAG_KEY = 'AW-940300881'

window.GTAG_EVENTS = [
  {
    name: 'Sign-up',
    category: 'Sign-up',
    config: { send_to: `${window.GTAG_KEY}/lmXdCP6DzuEBENG0r8AD`, transaction_id: '' },
  }, {
    name: 'Purchase',
    category: 'Purchase',
    config: { send_to: `${window.GTAG_KEY}/-8KACNKJv-EBENG0r8AD`, transaction_id: '' },
  }, {
    name: 'First Transaction Users',
    category: 'Begin checkout',
    config: { send_to: `${window.GTAG_KEY}/F5mACLjYrrUCENG0r8AD`, transaction_id: '' },
  },
]

// append gtag script
function gtag_append(trackId, id) {
  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackId}`
  const target = document.getElementsByTagName('head')[0] || document.body
  target.appendChild(script)
}

// initialize it with the input options
function gtag_initialize(trackId) {
  const w = window
  if (w.gtag) return

  gtag_append(trackId, 'gtagjs')

  w.dataLayer = w.dataLayer || []
  // eslint-disable-next-line
  const gtag = w.gtag = w.gtag || function () {
    // eslint-disable-next-line
    w.dataLayer.push(arguments)
  }
}

gtag_initialize(window.GTAG_KEY)
