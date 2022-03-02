/* eslint-disable no-console */

window.conversionMap = {
  register: 'Sign-up',
  'Order Completed': 'Purchase',
  'First transaction new user': 'First Transaction Users',
  // Topup: 'Purchase',
  // 'Instant Sell': 'Purchase',
}
window.uid = ''

if (window.navigator && window.screen) {
  window.uid = window.navigator.mimeTypes.length
  window.uid += window.navigator.userAgent.replace(/\D+/g, '')
  window.uid += window.navigator.plugins.length
  window.uid += window.screen.height || ''
  window.uid += window.screen.width || ''
  window.uid += window.screen.pixelDepth || ''
  window.uniqueDeviceId = window.uid
}

window.loggedInUserId = 0

window.version = 2

window.analytics = {
  initialize: () => {
    if (typeof window.devMode === 'undefined') {
      window.setTimeout(window.analytics.initialize, 100)

      return
    }

    if (window.devMode) {
      return
    }

    console.group('analytics initialize')

    // facebook
    if (window.fbq) {
      window.fbq('init', 491274214606334)
      window.fbq.disablePushState = true
      window.fbq('track', 'PageView')

      console.log('facebook analytics initialized')
    }

    // google analytics
    if (window.ga) {
      window.ga('create', 'UA-75122307-3', 'auto')
      window.ga('set', 'hostname', 'tradeit.gg')
      window.ga('require', 'ecommerce')
      window.ga('send', 'pageview')

      console.log('google analytics initialized')
    }

    // gtag analytics
    if (window.gtag) {
      window.gtag('js', new Date())
      window.gtag('config', window.GTAG_KEY, {
        anonymize_ip: true,
        send_page_view: false,
      })

      console.log('gtag analytics initialized')
    }

    console.groupEnd()
  },
  identify: (id, props) => {
    if (window.devMode) {
      return
    }

    window.loggedInUserId = id
    console.group('analytics identify', { id, props })

    // intercom
    window.Intercom && window.Intercom('boot', {
      ...props,
      app_id: 'a2xzru96',
      user_id: id,
      name: props.name,
      email: props.email,
      avatar: {
        type: 'avatar',
        image_url: props.avatar,
      },
    })
    console.log('intercom analytics identified')

    // google analytics
    if (window.ga) {
      window.ga('set', 'userId', id)
      window.ga('setUserProperties', props)
      console.log('google analytics identified')
    }

    console.groupEnd()
  },
  track: (eventName, data) => {
    if (window.devMode) {
      return
    }

    console.log('analytics track', { event: eventName, data })

    const completeData = { ...data, version: window.version }
    // amplitude
    window.amplitude && window.amplitude.track({
      event_properties: completeData,
      device_id: window.uniqueDeviceId,
      event_type: eventName,
      ...(window.loggedInUserId ? { user_id: window.loggedInUserId } : {}),
    })
    // google analytics
    window.ga && window.ga('send', 'event', {
      eventCategory: 'All',
      eventAction: eventName,
    })
    // intercom
    window.Intercom && window.Intercom('trackEvent', eventName, completeData)
    // facebook
    window.fbq && window.fbq('trackCustom', eventName, completeData)

    // gtag
    if (window.gtag && window.GTAG_EVENTS && window.conversionMap[eventName]) {
      const foundGtagEvent = window.GTAG_EVENTS.find((gtagEvent) => {
        return gtagEvent.name === window.conversionMap[eventName]
      })

      if (foundGtagEvent) {
        const { config } = foundGtagEvent
        if (config) {
          const params = (completeData && { ...config, ...completeData }) || config
          window.gtag('event', 'conversion', params)
        }
      }
    }
  },
  trackTradeFinished (data) {
    this.track('Order Completed', data)
    const completeData = { ...data, version: window.version }
    if (window.ga) {
      window.ga('ecommerce:addTransaction', {
        id: `'${new Date().getTime()}'`, // Transaction ID. Required.
        affiliation: 'tradeit.gg', // Affiliation or store name.
        revenue: completeData.revenue || '0', // Grand Total.
        shipping: '0', // Shipping.
        tax: '0', // Tax.
      })

      completeData.items && completeData.items.map(i => window.ga('ecommerce:addItem', {
        id: i.q.toString(), // Transaction ID. Required.
        name: '', // Product name. Required.
        sku: i.q.toString(), // SKU/code.
        category: i.g.toString(), // Category or variation.
        price: (i.p / 100).toFixed(2), // Unit price.
        quantity: '1', // Quantity.
      }))

      window.ga('ecommerce:send')
      window.ga('ecommerce:clear')
    }

    window.fbq && window.fbq('track', 'Purchase', completeData)

    // bing
    window.uetq && window.uetq.push('event', 'Purchase', {
      event_category: 'Purchase',
      event_label: 'Purchase',
      event_value: completeData.value,
    })
    window.ttq && window.ttq.track('CompletePayment')
  },
  trackAddToCart (data) {
    if (window.devMode) {
      console.log('trackAddToCart', data)
    }

    window.pushCriteoEvent && window.pushCriteoEvent('addToCart', {
      item: [
        {
          id: data.id,
          price: data.price / 100,
          quantity: 1,
        },
      ],
    })
    window.ttq && window.ttq.track('AddToCart', {
      content_id: data.id,
      content_type: 'product',
      quantity: 1,
      price: data.price / 100,
    })
  },
  trackFinishedRegister () {
    if (window.devMode) {
      console.log('register')
    }

    this.track('register')
    window.ttq && window.ttq.track('CompleteRegistration')
    window.twttr && window.twttr.conversion.trackPid('q5nwu', { tw_sale_amount: 0, tw_order_quantity: 0 })
    let twitterHtml = '<img height="1" width="1" style="display:none;" alt="" src="https://analytics.twitter.com/i/adsct?txn_id=q5nwu&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0" />'
    twitterHtml += '<img height="1" width="1" style="display:none;" alt="" src="//t.co/i/adsct?txn_id=q5nwu&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0" />'
    const noScriptTag = document.createElement('noscript')
    noScriptTag.innerHTML = twitterHtml
    document.body.append(noScriptTag)
  },
  trackInitiateCheckoutStore () {
    if (window.devMode) {
      console.log('InitiateCheckout Store')
    }

    this.track('Click Pay now (Store)')
    window.ttq && window.ttq.track('InitiateCheckout')
  },
  trackInitiateCheckoutTopup () {
    if (window.devMode) {
      console.log('InitiateCheckout Popup')
    }

    window.ttq && window.ttq.track('InitiateCheckout')
  },
  trackPlaceOrder () {
    if (window.devMode) {
      console.log('trackPlaceOrder')
    }

    window.ttq && window.ttq.track('PlaceAnOrder')
  },
  trackStorePurchaseFinished (id, items) {
    if (window.devMode) {
      console.log('trackStorePurchaseFinished', id, items)
    }

    window.ttq && window.ttq.track('CompletePayment')
    window.pushCriteoEvent && window.pushCriteoEvent('trackTransaction', {
      id,
      item: items,
    })
    window.twttr && window.twttr.conversion.trackPid('q5nwt', { tw_sale_amount: 0, tw_order_quantity: 0 })
    let twitterHtml = '<img height="1" width="1" style="display:none;" alt="" src="https://analytics.twitter.com/i/adsct?txn_id=q5nwt&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0" />'
    twitterHtml += '<img height="1" width="1" style="display:none;" alt="" src="//t.co/i/adsct?txn_id=q5nwt&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0" />'
    const noScriptTag = document.createElement('noscript')
    noScriptTag.innerHTML = twitterHtml
    document.body.append(noScriptTag)
  },
  trackViewContent (data) {
    if (window.devMode) {
      console.log('trackViewContent', data)
    }

    if (data.category) {
      window.ttq && window.ttq.track('Search', { query: data.keywords })
    } else {
      window.ttq && window.ttq.track('ViewContent')
    }

    window.pushCriteoEvent && window.pushCriteoEvent('viewList', data)
  },
  trackViewHomepage () {
    if (window.devMode) {
      console.log('trackViewHomepage')
    }

    window.ttq && window.ttq.track('ViewContent')
    window.pushCriteoEvent && window.pushCriteoEvent('viewHome')
  },
}

window.analytics.initialize()
