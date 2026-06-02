(function () {
  function registerTemplate() {
    if (!window.CMS || !window.h) {
      return false;
    }

    var h = window.h;

    function toArray(value) {
      if (!value) {
        return [];
      }
      if (Array.isArray(value)) {
        return value;
      }
      if (typeof value.toJS === 'function') {
        return value.toJS();
      }
      return [];
    }

    function getIn(entry, path, fallback) {
      if (!entry || !entry.getIn) {
        return fallback;
      }
      var value = entry.getIn(path);
      return value == null ? fallback : value;
    }

    function HomeSliderPreview(props) {
      var entry = props && props.entry ? props.entry : null;
      var slides = toArray(getIn(entry, ['data', 'attic', 'slides'], []));
      var transition = getIn(entry, ['data', 'attic', 'transition'], 'fade');
      var duration = getIn(entry, ['data', 'attic', 'duration'], 5000);
      var transitionDuration = getIn(entry, ['data', 'attic', 'transitionDuration'], 1200);
      var loop = getIn(entry, ['data', 'attic', 'loop'], true);

      var firstSlide = slides.length > 0 ? slides[0] : {};
      var firstImage = firstSlide.url || '';
      var firstTitle = firstSlide.title || 'Slide title preview';
      var firstTagline = firstSlide.tagline || 'Slide tagline preview';

      return h(
        'div',
        {
          style: {
            fontFamily: 'Segoe UI, Helvetica, Arial, sans-serif',
            background: '#f6f8fb',
            minHeight: '100vh',
            padding: '1rem'
          }
        },
        [
          h(
            'div',
            {
              style: {
                background: '#ffffff',
                border: '1px solid #e3e8ef',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 6px 18px rgba(15, 23, 42, 0.07)'
              }
            },
            [
              h(
                'h2',
                {
                  style: {
                    margin: '0 0 0.3rem 0',
                    fontSize: '1.1rem',
                    color: '#101828'
                  }
                },
                'Homepage Slider Preview'
              ),
              h(
                'p',
                {
                  style: {
                    margin: '0 0 1rem 0',
                    color: '#475467',
                    fontSize: '0.92rem'
                  }
                },
                'Single-slide preview shown intentionally to prevent duplicate full-page rendering in CMS.'
              ),
              h(
                'div',
                {
                  style: {
                    display: 'grid',
                    gap: '0.5rem',
                    marginBottom: '0.9rem',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))'
                  }
                },
                [
                  h('div', { style: { fontSize: '0.9rem', color: '#344054' } }, 'Slides: ' + slides.length),
                  h('div', { style: { fontSize: '0.9rem', color: '#344054' } }, 'Transition: ' + transition),
                  h('div', { style: { fontSize: '0.9rem', color: '#344054' } }, 'Duration: ' + duration + 'ms'),
                  h('div', { style: { fontSize: '0.9rem', color: '#344054' } }, 'Transition Speed: ' + transitionDuration + 'ms'),
                  h('div', { style: { fontSize: '0.9rem', color: '#344054' } }, 'Loop: ' + (loop ? 'On' : 'Off'))
                ]
              ),
              firstImage
                ? h('img', {
                    src: firstImage,
                    alt: firstSlide.alt || 'Homepage slider preview image',
                    style: {
                      width: '100%',
                      maxHeight: '52vh',
                      objectFit: 'contain',
                      borderRadius: '10px',
                      border: '1px solid #d0d7e2',
                      background: '#f8fafc'
                    }
                  })
                : h(
                    'div',
                    {
                      style: {
                        border: '1px dashed #d0d7e2',
                        borderRadius: '10px',
                        padding: '1rem',
                        color: '#475467',
                        fontSize: '0.92rem'
                      }
                    },
                    'No image selected yet for the first slide.'
                  ),
              h(
                'h3',
                {
                  style: {
                    margin: '0.85rem 0 0.2rem 0',
                    color: '#101828',
                    fontSize: '1rem'
                  }
                },
                firstTitle
              ),
              h(
                'p',
                {
                  style: {
                    margin: '0',
                    color: '#475467',
                    fontSize: '0.92rem'
                  }
                },
                firstTagline
              )
            ]
          )
        ]
      );
    }

    // Register both collection and file-entry keys for file-based collections.
    // Some Decap setups resolve preview templates by collection name, others by
    // file name in `collections[].files[].name`.
    window.CMS.registerPreviewTemplate('homepage_slider', HomeSliderPreview);
    window.CMS.registerPreviewTemplate('home_slider_profile', HomeSliderPreview);
    window.__mkHomeSliderPreviewRegistered = true;
    window.__mkHomeSliderPreviewRegisteredKeys = ['homepage_slider', 'home_slider_profile'];
    return true;
  }

  registerTemplate();

  var attempts = 0;
  var maxAttempts = 100;
  var timer = window.setInterval(function () {
    attempts += 1;
    try {
      if (registerTemplate() || attempts >= maxAttempts) {
        window.clearInterval(timer);
      }
    } catch (error) {
      window.__mkHomeSliderPreviewError = String(error);
      window.clearInterval(timer);
    }
  }, 100);
})();