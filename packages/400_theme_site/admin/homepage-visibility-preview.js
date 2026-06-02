(function () {
  window.__mkHomeVisibilityPreviewScriptLoaded = true;

  function registerTemplate() {
    if (!window.CMS || !window.h) {
      return false;
    }

    if (window.CMS.registerPreviewStyle && !window.__mkPreviewStyleRegistered) {
      window.CMS.registerPreviewStyle('/admin/preview-overrides.css');
      window.__mkPreviewStyleRegistered = true;
    }

    var h = window.h;

  var lanes = [
    { key: 'header', label: 'Header (Attic)' },
    { key: 'custom_header', label: 'Custom Header' },
    { key: 'banner_home_teaser', label: 'Teaser Banner' },
    { key: 'banner_divider_1', label: 'Divider Banner' },
    { key: 'banner_home_image', label: 'Image Banner' },
    { key: 'panel_home_intro', label: 'Intro Panel' },
    { key: 'banner_home_parallax', label: 'Parallax Banner' },
    { key: 'panel_home_service', label: 'Service Panel' },
    { key: 'panel_home_plan', label: 'Plan Panel' },
    { key: 'panel_home_news', label: 'News Panel' },
    { key: 'google_adsense_template', label: 'Google Adsense (Template)' },
    { key: 'google_adsense_slot', label: 'Google Adsense (Slot)' },
    { key: 'custom_content_static_accordion', label: 'Custom Content (Static Accordion)' },
    { key: 'custom_content_template_accordion', label: 'Custom Content (Template Accordion)' },
    { key: 'custom_content_people_panel', label: 'Custom Content (People Panel)' },
    { key: 'custom_content_collection_panel', label: 'Custom Content (Collection Panel)' }
  ];

  function isEnabled(value) {
    return value === true || value === 'true';
  }

  function getValue(data, key) {
    if (!data || !data.get) {
      return 'false';
    }

    var value = data.get(key);
    return value == null ? 'false' : value;
  }

  function laneCard(lane, data) {
    var enabled = isEnabled(getValue(data, lane.key));
    var stateText = enabled ? 'Enabled' : 'Disabled';

    return h(
      'div',
      {
        key: lane.key,
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          padding: '0.65rem 0.8rem',
          border: '1px solid #d9dfe7',
          borderRadius: '10px',
          background: enabled ? '#ecfff4' : '#fff4f4'
        }
      },
      [
        h('span', { style: { fontWeight: 600, color: '#1f2a37' } }, lane.label),
        h(
          'span',
          {
            style: {
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: enabled ? '#067647' : '#b42318'
            }
          },
          stateText
        )
      ]
    );
  }

    function HomeVisibilityPreview(props) {
      var data = props.entry && props.entry.get ? props.entry.get('data') : null;

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
                'Homepage Lane Visibility Preview'
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
                'This preview updates while you edit. Enabled lanes are green; disabled lanes are red.'
              ),
              h(
                'div',
                {
                  style: {
                    display: 'grid',
                    gap: '0.6rem'
                  }
                },
                lanes.map(function (lane) {
                  return laneCard(lane, data);
                })
              )
            ]
          )
        ]
      );
    }

    window.CMS.registerPreviewTemplate('homepage_visibility', HomeVisibilityPreview);
    window.CMS.registerPreviewTemplate('home_lane_visibility', HomeVisibilityPreview);
    window.__mkHomeVisibilityPreviewRegistered = true;
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
      window.__mkHomeVisibilityPreviewError = String(error);
      window.clearInterval(timer);
    }
  }, 100);
})();
