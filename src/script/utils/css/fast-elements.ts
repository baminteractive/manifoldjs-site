import { css } from 'lit';

export const fastButtonCss = css`
  fast-button {
    color: var(--button-font-color);
    height: var(--button-height);
    width: var(--button-width);

    border-radius: var(--button-radius);
    box-shadow: var(--button-shadow);
  }

  fast-button:disabled::part(control) {
    cursor: not-allowed;
  }

  fast-button::part(control) {
    font-size: var(--font-size);
    font-weight: var(--font-bold);
    width: 100%;
    padding-top: var(--padding-vertical);
    padding-bottom: var(--padding-vertical);
    padding-left: var(--padding-horizontal);
    padding-right: var(--padding-horizontal);
  }

  fast-button.secondary {
    background: var(--secondary-color);
    color: var(--font-color);
    border-color: transparent;
  }

  fast-button[appearance='lightweight'] {
    --accent-foreground-rest: var(--secondary-font-color);
    --accent-foreground-active: var(--font-color);
    --accent-foreground-hover: var(--font-color);
  }
`;

export const fastAnchorCss = css`
  @media screen and (min-width: 480px) and (max-width: 639px) {
    fast-anchor.button {
      font-size: 22px;
      height: 64px;
    }
  }
`;

export const fastTextFieldCss = css`
  fast-text-field {
    --accent-fill-rest: var(--secondary-font-color);
    --accent-fill-active: var(--font-color);
    --accent-fill-hover: var(--font-color);
  }

  fast-text-field.error {
    --neutral-foreground-rest: var(--error-color);
    --accent-fill-rest: var(--error-color);
    --accent-fill-active: var(--error-color);
  }
`;

export const fastCheckboxCss = css`
  fast-checkbox {
    --accent-fill-rest: var(--link-color);
    --accent-fill-active: var(--link-color);
    --accent-fill-hover: var(--link-color);
  }
`;

export const fastRadioCss = css`
  fast-radio {
    --neutral-fill-input-rest: var(--primary-background-color);
    --accent-foreground-cut-rest: var(--primary-backgroud-color);
    --accent-fill-rest: var(--link-color);
    --accent-fill-active: var(--link-color);
    --accent-fill-hover: var(--link-color);
  }
`;

export const fastMenuCss = css`
  fast-menu {
  }

  fast-menu-item {
    --neutral-fill-input-rest: var(--primary-background-color);
    --accent-foreground-cut-rest: var(--primary-backgroud-color);
    --accent-fill-rest: var(--link-color);
    --accent-fill-active: var(--link-color);
    --accent-fill-hover: var(--link-color);
  }
`;
