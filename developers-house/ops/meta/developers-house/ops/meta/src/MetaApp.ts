/* eslint-disable lit-a11y/click-events-have-key-events */
import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export class MetaApp extends LitElement {
  static styles = css`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      text-align: justify;
    }

    main {
      height: calc(100% - 4em);
      padding: 2em;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    section {
      display: flex;
      flex-direction: column;
    }

    section h1,
    section p,
    section a {
      margin-top: 1.5em;
    }

    a {
      width: fit-content;
      text-decoration: none;
      padding: 0.75em;
      border: 0.15em solid rgb(210, 210, 210);
      border-radius: 5px;
      background-color: rgb(225, 225, 225);
      color: rgb(41, 136, 244);
    }

    a:hover {
      text-decoration: underline;
    }
  `;

  @property()
  count = 0;

  handleClick() {
    this.count += 1;

    if (this.count === 6) {
      this.count = 0;
    }
  }

  render() {
    return html`
      <main>
        <section>
          <img
            src=${this.count === 5
              ? 'https://cdn.developershouse.xyz/assets/amongus.gif'
              : 'https://cdn.developershouse.xyz/assets/DevHouse_Logo.svg'}
            alt="Developers House's banner"
            @click=${this.handleClick}
          />
          <h1>Resource not found</h1>
          <p>
            The requested URL <code>${window.location.pathname}</code> was not
            found on our services. We're sorry for this desagreement.
          </p>
          <a href="https://developershouse.xyz">Go to website</a>
        </section>
      </main>
    `;
  }
}
