/**
 * Hans Footer Web Component
 * Reusable, self-contained footer displaying the Hans logo and "made by hans" link,
 * with an optional GitHub source link.
 */
class HansFooter extends HTMLElement {
  static get observedAttributes() {
    return ['github-url'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  adjustContrast() {
    if (this.isDarkBackground()) {
      const footer = this.shadowRoot.querySelector('.footer');
      if (footer) {
        footer.classList.add('auto-dark');
      }
    }
  }

  isDarkBackground() {
    let el = this;
    let bg = 'rgb(255, 255, 255)';
    while (el) {
      const style = window.getComputedStyle(el);
      if (style && style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') {
        bg = style.backgroundColor;
        break;
      }
      el = el.parentElement || (el.getRootNode() && el.getRootNode().host);
    }
    
    const match = bg.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0], 10);
      const g = parseInt(match[1], 10);
      const b = parseInt(match[2], 10);
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      return yiq < 128;
    }
    return false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'github-url' && oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    // Resolve logo SVG path relative to this script location
    let scriptSrc = '';
    if (document.currentScript && document.currentScript.src) {
      scriptSrc = document.currentScript.src;
    } else {
      // Find script tag that loaded this script (works for modules / deferred scripts)
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src && (scripts[i].src.includes('footer.js') || scripts[i].src.includes('hans-footer.js'))) {
          scriptSrc = scripts[i].src;
          break;
        }
      }
    }

    let baseUrl = '';
    if (scriptSrc) {
      baseUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1);
    } else {
      baseUrl = './';
    }
    const svgUrl = baseUrl + 'hans-logo.svg';
    const profileUrl = baseUrl + 'hans-profile-small.jpg';
    const githubUrl = this.getAttribute('github-url');

    const githubHtml = githubUrl
      ? `<span class="github-section"><span class="sep">|</span> <span class="github-text-part">source on </span><a href="${this.escapeHtml(githubUrl)}" target="_blank" rel="noopener noreferrer" class="github-link">github</a></span>`
      : '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-top: auto;
          min-height: 76px; /* Reserve height to prevent Cumulative Layout Shift */
          --hans-footer-logo-filter: invert(0);
          --hans-footer-color: rgb(68, 68, 65);
        }
        
        .footer {
          padding: 2rem 1rem calc(6px + var(--safe-bottom, 0px));
          display: flex;
          justify-content: center;
        }

        .footer.auto-dark {
          --hans-footer-logo-filter: invert(1);
          --hans-footer-color: rgb(240, 240, 240);
        }

        .footer-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .logo-link {
          display: inline-block;
          line-height: 0;
          cursor: pointer;
        }

        .logo-wrapper {
          position: relative;
          width: 30px;
          height: 30px;
        }

        .logo {
          position: absolute;
          transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
        }

        .default-logo {
          top: 3px;
          left: 3px;
          width: 24px;
          height: 24px;
          opacity: 0.4;
          filter: var(--hans-footer-logo-filter);
        }

        .profile-pic {
          top: 0;
          left: 0;
          width: 30px;
          height: 30px;
          opacity: 0;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
          box-sizing: border-box;
          object-fit: cover;
          transform: scale(0.8);
        }

        .text-line {
          font: 500 0.65rem/1.4 system-ui, -apple-system, sans-serif;
          letter-spacing: 0.05em;
          color: var(--hans-footer-color);
          margin: 0;
          text-align: center;
        }

        /* Set default opacity of 0.5 on the spans and links inside the text line */
        .text-line > span:not(.github-section),
        .about-link,
        .sep,
        .github-text-part,
        .github-link {
          opacity: 0.5;
        }

        .about-link,
        .github-link {
          color: inherit;
          text-decoration: underline;
        }

        .github-section {
          white-space: nowrap;
        }

        .sep {
          margin: 0 4px;
        }

        /* Hover States */

        /* 1. Hovering the logo itself: Only increases the default logo opacity to 0.6 */
        .logo-link:hover .default-logo {
          opacity: 0.6;
        }

        /* 2. Hovering the 'hans' link: transitions the logo to the 30px profile photo */
        .footer-container:has(.hans-link:hover) .default-logo {
          opacity: 0;
          transform: scale(0.8);
        }
        .footer-container:has(.hans-link:hover) .profile-pic {
          opacity: 1;
          transform: scale(1);
        }

        /* Increase contrast of the links on hover */
        .hans-link:hover,
        .github-link:hover {
          opacity: 1;
        }
      </style>
      <footer class="footer">
        <div class="footer-container">
          <a href="https://haaans.com/about/" target="_blank" rel="noopener noreferrer" class="logo-link">
            <div class="logo-wrapper">
              <img class="logo default-logo" alt="Hans Logo" src="${this.escapeHtml(svgUrl)}">
              <img class="logo profile-pic" alt="Hans Profile" src="${this.escapeHtml(profileUrl)}">
            </div>
          </a>
          <p class="text-line">
            <span>made by </span><a href="https://haaans.com/about/" target="_blank" rel="noopener noreferrer" class="about-link hans-link">hans</a>
            ${githubHtml}
          </p>
        </div>
      </footer>
    `;
    requestAnimationFrame(() => this.adjustContrast());
  }

  escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
}

customElements.define('hans-footer', HansFooter);
